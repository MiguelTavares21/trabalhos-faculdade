const Requests = require("../models/requestsModel");
const Rules = require("../models/rulesModel");
const Doadores = require("../models/doadorModel");
const Entity = require("../models/entidadeBeneficiadoraModel");
const fs = require("fs");

const criarRequests = async (req, res) => {
  try {
    const pontosCalculados = await calcularPontos(req.body);
    const dataASettar = Date.now();

    let imagens = [];
    if (req.files && req.files["fotos"]) {
      imagens = req.files["fotos"].map((file) => file.path);
    }

    const doador = await Doadores.findOne({ email: req.body.email });
    const entity = await Entity.findOne({ nome: req.body.entidade });

    if (!doador || !entity || entity.status !== "aceite") {
      if (req.files && req.files["fotos"]) {
        req.files["fotos"].forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }
      return res.status(500).render("error", {
        message: "Cliente não encontrado",
        error: "Doador ou entidade não encontrados ou entidade não aceita",
      });
    } else {
      var codigoRaiserForDonations = "Sem código";
      const codigoCheck = doador.codigoAngariadorConvidado;
      console.log(codigoCheck);
      if (codigoCheck !== "Sem código") {
        const angariadorConvidado = await Doadores.findOne({
          codigoAngariador: codigoCheck,
        });
        if (!angariadorConvidado) {
          throw new Error("Este código de convite não está registado");
        }
        codigoRaiserForDonations = codigoCheck;
      }

      let request = new Requests({
        ...req.body,
        pontos: pontosCalculados,
        fotos: imagens,
        data: dataASettar,
        estado: "Por iniciar",
        codigoAngariador: codigoRaiserForDonations,
      });

      let error = request.validateSync();

      if (error) {
        console.log(error);
        return res.status(400).render("error", {
          message: "Erro de validação",
          error: error.message,
        });
      }

      request = await request.save();

      console.log("Pedido realizado com sucesso" + request);
      res.render("requests/requestCreated", { request, doador });
    }
  } catch (error) {
    res.status(500).render("error", {
      message: "Ocorreu um erro ao criar o pedido",
      error: error.message,
    });
  }
};

const criarRequests2 = async (req, res) => {
  try {
    const pontosCalculados = await calcularPontos(req.body);

    let imagens = [];
    if (req.files && req.files["fotos"]) {
      imagens = req.files["fotos"].map((file) => file.path);
    }

    const doador = await Doadores.findOne({ email: req.user.email });
    const entity = await Entity.findOne({ nome: req.body.entidade });

    if (!doador || !entity || entity.status !== "aceite") {
      if (req.files && req.files["fotos"]) {
        req.files["fotos"].forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }
      return res.status(500).json({
        message: "Cliente, ou entidade, não encontrado(a)",
        error: "Doador ou entidade não encontrados ou entidade não aceite",
      });
    } else {
      var codigoRaiserForDonations = "Sem código";
      const codigoCheck = doador.codigoAngariadorConvidado;
      console.log(codigoCheck);
      if (codigoCheck !== "Sem código") {
        const angariadorConvidado = await Doadores.findOne({
          codigoAngariador: codigoCheck,
        });
        if (!angariadorConvidado) {
          throw new Error("Este código de convite não está registado");
        }
        codigoRaiserForDonations = codigoCheck;
      }

      let request = new Requests({
        ...req.body,
        email: req.user.email,
        pontos: pontosCalculados,
        fotos: imagens,
        codigoAngariador: codigoRaiserForDonations,
      });

      let error = request.validateSync();

      if (error) {
        console.log(error);
        return res.status(400).json({
          message: "Erro de validação",
          error: error.message,
        });
      }

      request = await request.save();

      console.log("Pedido realizado com sucesso" + request);
      res.status(201).json(request);
    }
  } catch (error) {
    res.status(500).json({
      message: "Ocorreu um erro ao criar o pedido",
      error: error.message,
    });
  }
};

const calcularPontos = async (formData) => {
  const pontosPorPecaCrianca = await getPontosPorPecaCriancaFromDatabase();
  const pontosPorPecaAdulto = await getPontosPorPecaAdultoFromDatabase();
  const pontosPorPecaAdolescente =
    await getPontosPorPecaAdolescenteFromDatabase();
  const pontosPorQuilo = await getPontosPorQuiloFromDatabase();
  const pontosPorTipoInterior = await getPontosPorTipoInteriorFromDatabase();
  const pontosPorTipoInferior = await getPontosPorTipoInferiorFromDatabase();
  const pontosPorTipoTronco = await getPontosPorTipoTroncoFromDatabase();
  const pontosPorTipoCalcado = await getPontosPorTipoCalcadoFromDatabase();
  const pontosPorEstadoRoupaNovo =
    await getPontosPorEstadoRoupaNovoFromDatabase();
  const pontosPorEstadoRoupaSemiNovo =
    await getPontosPorEstadoRoupaSemiNovoFromDatabase();
  const pontosPorEstadoRoupaUsado =
    await getPontosPorEstadoRoupaUsadoFromDatabase();

  let pontosCalculados =
    formData.pecasCrianca * pontosPorPecaCrianca +
    formData.pecasAdulto * pontosPorPecaAdulto +
    formData.pecasAdolescente * pontosPorPecaAdolescente +
    formData.kilos * pontosPorQuilo;

  if (formData.pecasTipoInterior > 0) {
    pontosCalculados += pontosPorTipoInterior;
  }
  if (formData.pecasTipoInferior > 0) {
    pontosCalculados += pontosPorTipoInferior;
  }
  if (formData.pecasTipoTronco > 0) {
    pontosCalculados += pontosPorTipoTronco;
  }
  if (formData.pecasTipoCalcado > 0) {
    pontosCalculados += pontosPorTipoCalcado;
  }

  if (formData.estadoRoupa === "Novo") {
    pontosCalculados += pontosPorEstadoRoupaNovo;
  } else if (formData.estadoRoupa === "Semi-Novo") {
    pontosCalculados += pontosPorEstadoRoupaSemiNovo;
  } else if (formData.estadoRoupa === "Usado") {
    pontosCalculados += pontosPorEstadoRoupaUsado;
  }

  pontosCalculados = Math.round(pontosCalculados);
  return pontosCalculados;
};

async function getPontosPorQuiloFromDatabase() {
  try {
    const pontos = await Rules.findOne({ _id: "661d4d0a93b3907303e6c970" });
    return pontos.pontosPorKilo;
  } catch (error) {
    console.error("Erro ao buscar pontos por quilo:", error);
    throw error;
  }
}
async function getPontosPorPecaAdultoFromDatabase() {
  try {
    const pontos = await Rules.findOne({ _id: "661d4d0a93b3907303e6c970" });
    return pontos.pontosPorPecaAdulto;
  } catch (error) {
    console.error("Erro ao buscar pontos por peça de roupa de adulto:", error);
    throw error;
  }
}
async function getPontosPorPecaCriancaFromDatabase() {
  try {
    const pontos = await Rules.findOne({ _id: "661d4d0a93b3907303e6c970" });
    return pontos.pontosPorPecaCrianca;
  } catch (error) {
    console.error("Erro ao buscar pontos por peça de roupa de criança:", error);
    throw error;
  }
}
async function getPontosPorPecaAdolescenteFromDatabase() {
  try {
    const pontos = await Rules.findOne({ _id: "661d4d0a93b3907303e6c970" });
    return pontos.pontosPorPecaAdolescente;
  } catch (error) {
    console.error(
      "Erro ao buscar pontos por peça de roupa de adolescente:",
      error
    );
    throw error;
  }
}
async function getPontosPorTipoInteriorFromDatabase() {
  try {
    const pontos = await Rules.findOne({ _id: "661d4d0a93b3907303e6c970" });
    return pontos.pontosPorTipoInterior;
  } catch (error) {
    console.error("Erro ao buscar pontos por peça de roupa interior:", error);
    throw error;
  }
}
async function getPontosPorTipoInferiorFromDatabase() {
  try {
    const pontos = await Rules.findOne({ _id: "661d4d0a93b3907303e6c970" });
    return pontos.pontosPorTipoInferior;
  } catch (error) {
    console.error("Erro ao buscar pontos por peça de roupa inferior:", error);
    throw error;
  }
}
async function getPontosPorTipoTroncoFromDatabase() {
  try {
    const pontos = await Rules.findOne({ _id: "661d4d0a93b3907303e6c970" });
    return pontos.pontosPorTipoTronco;
  } catch (error) {
    console.error("Erro ao buscar pontos por peça de roupa tronco:", error);
    throw error;
  }
}
async function getPontosPorTipoCalcadoFromDatabase() {
  try {
    const pontos = await Rules.findOne({ _id: "661d4d0a93b3907303e6c970" });
    return pontos.pontosPorTipoCalcado;
  } catch (error) {
    console.error("Erro ao buscar pontos por calçado:", error);
    throw error;
  }
}
async function getPontosPorEstadoRoupaNovoFromDatabase() {
  try {
    const pontos = await Rules.findOne({ _id: "661d4d0a93b3907303e6c970" });
    return pontos.pontosPorEstadoRoupaNovo;
  } catch (error) {
    console.error("Erro ao buscar pontos por peça de roupa nova:", error);
    throw error;
  }
}
async function getPontosPorEstadoRoupaSemiNovoFromDatabase() {
  try {
    const pontos = await Rules.findOne({ _id: "661d4d0a93b3907303e6c970" });
    return pontos.pontosPorEstadoRoupaSemiNovo;
  } catch (error) {
    console.error("Erro ao buscar pontos por peça de roupa semi-nova:", error);
    throw error;
  }
}
async function getPontosPorEstadoRoupaUsadoFromDatabase() {
  try {
    const pontos = await Rules.findOne({ _id: "661d4d0a93b3907303e6c970" });
    return pontos.pontosPorEstadoRoupaUsado;
  } catch (error) {
    console.error("Erro ao buscar pontos por peça de roupa usada:", error);
    throw error;
  }
}

async function getPontosCodigoFromDatabase() {
  try {
    const pontos = await Rules.findOne({ _id: "661d4d0a93b3907303e6c970" });
    return pontos.pontosCodigo;
  } catch (error) {
    console.error("Erro ao buscar pontos por código de angariador:", error);
    throw error;
  }
}

const listarPedidos = async (req, res) => {
  try {
    const pedidos = await Requests.find();
    res.render("requests/listaPedidos", { pedidos });
  } catch (error) {
    console.log("Ocorreu um erro: " + error);
    res.redirect("/requests");
  }
};

const editarRequestForm = async (req, res) => {
  try {
    const pedido = await Requests.findById(req.params.id);
    res.render("requests/editarPedido", { pedido });
  } catch (error) {
    console.log("Ocorreu um erro: " + error);
    res.redirect("/requests");
  }
};

const editarRequest = async (req, res) => {
  try {
    const { pedidoId } = req.body;

    const doador = await Doadores.findOne({ email: req.body.email });
    const entity = await Entity.findOne({ nome: req.body.entidade });

    if (!entity || entity.status !== "aceite") {
      return res
        .status(404)
        .json({ message: "Entidade não encontrada ou não validada." });
    } else {
      const pedido = await Requests.findById(pedidoId);
      if (!pedido) {
        return res.status(404).json({ message: "Pedido não encontrado." });
      }

      if (pedido.estado === "Validado") {
        return res
          .status(400)
          .json({ message: "Não é possível alterar uma doação validada." });
      }

      let error = pedido.validateSync();
      if (error) {
        const errorMessage =
          error.message || "Erro desconhecido de validação do pedido.";
        return res.status(400).json({ message: errorMessage });
      }

      const pecasAdulto = parseInt(req.body.pecasAdulto);
      const pecasCrianca = parseInt(req.body.pecasCrianca);
      const pecasAdolescente = parseInt(req.body.pecasAdolescente);

      const numeroPecasUpdated = pecasAdulto + pecasCrianca + pecasAdolescente;

      const pecasTipoInferior = parseInt(req.body.pecasTipoInferior);
      const pecasTipoInterior = parseInt(req.body.pecasTipoInterior);
      const pecasTipoTronco = parseInt(req.body.pecasTipoTronco);
      const pecasTipoCalcado = parseInt(req.body.pecasTipoCalcado);

      const somaPecasTipos =
        pecasTipoInterior +
        pecasTipoInferior +
        pecasTipoTronco +
        pecasTipoCalcado;

      if (somaPecasTipos > numeroPecasUpdated) {
        return res.status(401).json({
          message:
            "O número de peças de diferentes tipos não corresponde ao número de peças totais.",
        });
      }

      var codigoRaiserForDonations = "Sem código";
      const codigoCheck = doador.codigoAngariadorConvidado;
      console.log(codigoCheck);
      if (codigoCheck !== "Sem código") {
        const angariadorConvidado = await Doadores.findOne({
          codigoAngariador: codigoCheck,
        });
        if (!angariadorConvidado) {
          throw new Error("Este código de convite não está registado");
        }
        codigoRaiserForDonations = codigoCheck;
      }

      const updatedPontosCalculados = await calcularPontos(req.body);

      await Requests.findByIdAndUpdate(pedidoId, {
        ...req.body,
        numeroPecas: numeroPecasUpdated,
        pontos: updatedPontosCalculados,
        codigoAngariador: codigoRaiserForDonations,
      });

      await entity.save();
      await doador.save();

      updateUserAndEntityAfterState(pedidoId);

      await Requests.findById(pedidoId);
      res.status(200).json({ message: "Pedido atualizado com sucesso" });
    }
  } catch (error) {
    console.log("Ocorreu um erro: " + error);
    return res
      .status(500)
      .json({ message: "Ocorreu um erro ao editar o pedido." });
  }
};

const getPedidosPorMes = async (req, res) => {
  try {
    const { ano } = req.query;
    const pedidosPorMes = await Requests.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $year: "$data" }, parseInt(ano)],
          },
        },
      },
      {
        $group: {
          _id: { $month: "$data" },
          total: { $sum: 1 },
        },
      },
    ]);

    res.json({ pedidosPorMes });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar os pedidos por mês",
      message: error.message,
    });
  }
};

const criarPedidoRecolhaForm = async (req, res) => {
  try {
    const entities = await Entity.find({ status: "aceite" });

    res.render("forms/formPedido", { entities });
  } catch (error) {
    res.status(500).send("Erro ao carregar entidades.");
  }
};

const mostrarRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await Requests.findById(requestId);
    if (!request) {
      return res.status(404).send("Pedido não encontrado.");
    }

    const doador = await Doadores.findOne({ email: request.email });
    if (!doador) {
      return res.status(404).send("Doador não encontrado.");
    }

    res.render("requests/requestCreated", { request, doador });
  } catch (error) {
    res
      .status(500)
      .send("Ocorreu um erro ao buscar o pedido: " + error.message);
  }
};

const getPedidos2 = async (req, res) => {
  try {
    if (req.user.role === "doador") {
      const doacoes = await Requests.find({
        email: req.user.email,
      });
      console.log("entrei aqui getPedidos2 doador");
      console.log(doacoes);
      res.status(201).json({ doacoes });
    } else if (req.user.role === "entidade") {
      const entidadeFetch = await Entity.findOne({
        email: req.user.email,
      });
      const doacoes = await Requests.find({
        entidade: entidadeFetch.nome,
        estado: { $ne: "Por iniciar" },
      });
      console.log("entrei aqui getPedidos2 entidade");
      console.log(doacoes);
      res.status(201).json({ doacoes });
    }
  } catch (error) {
    res.status(500).json({
      message: "Ocorreu um erro ao listar as doações",
      error: error.message,
    });
  }
};

const updateDoacaoState2 = async (req, res) => {
  try {
    const donationId = req.body.doacaoId;
    console.log(donationId);
    const result = await Requests.findByIdAndUpdate(donationId, {
      estado: req.body.doacaoState,
      data: Date.now(),
    });

    updateUserAndEntityAfterState(donationId);
    res.status(201).json({ result });
  } catch (error) {
    res.status(500).json({
      message: "Ocorreu um erro ao atualizar o estado da doação",
      error: error.message,
    });
  }
};

async function updateUserAndEntityAfterState(donationId) {
  const donation = await Requests.findById(donationId);
  const entidade = await Entity.findOne({ nome: donation.entidade });
  const doador = await Doadores.findOne({ email: donation.email });
  const raiser = await Doadores.findOne({
    codigoAngariador: donation.codigoAngariador,
  });
  console.log(raiser);
  var checkedRaiser = 0;
  if (doador.codigoAngariadorConvidado !== "Sem código") {
    checkedRaiser = 1;
  }

  if (donation.estado === "A realizar") {
    entidade.doacoesPorValidar.push(donationId);
    entidade.doacoesValidadas = entidade.doacoesValidadas.filter(
      (doacao) => doacao !== donationId
    );
  } else if (donation.estado === "Validado") {
    entidade.doacoesPorValidar = entidade.doacoesPorValidar.filter(
      (doacao) => doacao !== donationId
    );
    entidade.doacoesValidadas.push(donationId);
    entidade.numeroDoacoes += 1;
    doador.doacoes.push(donationId);
    doador.numeroDoacoes += 1;
    doador.numeroPontos += donation.pontos;

    if (doador.codigoAngariadorConvidado !== "Sem código") {
      if (checkedRaiser === 1) {
        raiser.doacoesAngariadas.push(donationId);
        raiser.numeroPontos += await getPontosCodigoFromDatabase();
      }
    }
  } else {
    entidade.doacoesPorValidar = entidade.doacoesPorValidar.filter(
      (doacao) => doacao !== donationId
    );
    entidade.doacoesValidadas = entidade.doacoesValidadas.filter(
      (doacao) => doacao !== donationId
    );
  }

  await entidade.save();
  await doador.save();
  if (checkedRaiser === 1) {
    await raiser.save();
  }
}

module.exports = {
  criarRequests,
  listarPedidos,
  editarRequestForm,
  editarRequest,
  getPedidosPorMes,
  criarPedidoRecolhaForm,
  mostrarRequest,
  criarRequests2,
  getPedidos2,
  updateDoacaoState2,
};
