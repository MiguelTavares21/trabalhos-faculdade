const bcrypt = require("bcryptjs");
const Doador = require("../models/doadorModel");
const Funcionario = require("../models/funcionarioModel");
const Entidade = require("../models/entidadeBeneficiadoraModel");
const path = require("path");
const fs = require("fs");
const emailController = require("../controllers/emailController");
const authController = require("../controllers/loginController");

const criarDoador = async (req, res) => {
  try {
    const user = await getUser(req.body.email);

    if (user) {
      if (req.files && req.files["fotoPerfil"]) {
        fs.unlinkSync(req.files["fotoPerfil"][0].path);
      }
      return res.render("error", {
        message: "Email já está a ser utilizado",
        error: "Email já está a ser utilizado",
      });
    }

    const codigoAngariador = await Doador.findOne({
      codigoAngariador: req.body.codigoAngariador,
    });
    if (codigoAngariador) {
      throw new Error("Este código de angariador já está a ser utilizado");
    }

     var codigoRaiserForDonations = "Sem código";

    if (req.body.codigoAngariadorConvidado) {
      const codigoAngariadorConvidado = await Doador.findOne({
        codigoAngariador: req.body.codigoAngariadorConvidado,
      });
      if (!codigoAngariadorConvidado) {
        throw new Error("Este código de convite não está registado");
      }else{
        codigoRaiserForDonations = codigoAngariadorConvidado.codigoAngariador;
      }
    }

    let foto = "uploads/images.png";

    if (req.files["fotoPerfil"] && req.files["fotoPerfil"][0]) {
      foto = req.files["fotoPerfil"][0].path;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const novoDoador = new Doador({
      ...req.body,
      password: hashedPassword,
      fotoPerfil: foto,
      codigoAngariadorConvidado: codigoRaiserForDonations,
    });

    await novoDoador.validate();

    await novoDoador.save();

    emailController.sendEmail({
      subject: "Novo doador registado!",
      text: `O doador ${novoDoador.nome} ${novoDoador.apelido}, foi registado com o email ${novoDoador.email} às ${novoDoador.data}.`,
    });

    res.render("doadores/doadorCreated", {
      nome: novoDoador.nome,
      apelido: novoDoador.apelido,
      email: novoDoador.email,
      nif: novoDoador.nif,
      morada: novoDoador.morada,
      contacto: novoDoador.contacto,
      fotoPerfil: novoDoador.fotoPerfil,
    });
  } catch (error) {
    res.status(500).render("error", {
      message: "Ocorreu um erro ao adicionar o doador",
      error: error,
    });
  }
};

const criarDoador2 = async (req, res) => {
  try {
    const user = await Doador.findOne({ email: req.body.email });
    if (user) {
      throw new Error("Email já está a ser utilizado");
    }

    const nif = await Doador.findOne({ nif: req.body.nif });
    if (nif) {
      throw new Error("NIF já está a ser utilizado");
    }

    const codigoAngariador = await Doador.findOne({
      codigoAngariador: req.body.codigoAngariador,
    });
    if (codigoAngariador) {
      throw new Error("Este código de angariador já está a ser utilizado");
    }


    var codigoRaiserForDonations = "Sem código";

    if (req.body.codigoAngariadorConvidado) {
      const codigoAngariadorConvidado = await Doador.findOne({
        codigoAngariador: req.body.codigoAngariadorConvidado,
      });
      if (!codigoAngariadorConvidado) {
        throw new Error("Este código de convite não está registado");
      } else {
        codigoRaiserForDonations = codigoAngariadorConvidado.codigoAngariador;
      }
    }

    let foto = "uploads/images.png";

    if (req.files && req.files["fotoPerfil"] && req.files["fotoPerfil"][0]) {
      foto = req.files["fotoPerfil"][0].path;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const novoDoador = new Doador({
      nome: req.body.nome,
      apelido: req.body.apelido,
      email: req.body.email,
      password: hashedPassword,
      nif: req.body.nif,
      morada: req.body.morada,
      codigoAngariador: req.body.codigoAngariador,
      codigoAngariadorConvidado: codigoRaiserForDonations,
      contacto: req.body.contacto,
      fotoPerfil: foto,
    });

    await novoDoador.validate();
    await novoDoador.save();

    emailController.sendEmail({
      subject: "Novo doador registado!",
      text: `O doador ${novoDoador.nome} ${novoDoador.apelido}, foi registado com o email ${novoDoador.email} às ${novoDoador.data}.`,
    });

    res.status(201).json({
      message: "Doador criado com sucesso",
      doador: novoDoador,
    });
  } catch (error) {
    console.error("Erro ao adicionar o doador:", error);
    if (req.files && req.files["fotoPerfil"] && req.files["fotoPerfil"][0]) {
      fs.unlinkSync(req.files["fotoPerfil"][0].path);
    }
    res.status(500).json({
      message: "Ocorreu um erro ao adicionar o doador",
      error: error.message,
    });
  }
};

const verTodosDoadores = async (req, res) => {
  try {
    const doadores = await Doador.find();
    res.render("doadores/verTodosDoadores", { doadores });
  } catch (error) {
    res.status(500).render("error", {
      message: "Ocorreu um erro ao procurar os doadores",
      error: error,
    });
  }
};

const removerDoador = async (req, res) => {
  const { doadorId } = req.body;
  try {
    const doador = await Doador.findOne({ _id: doadorId });

    if (doador.fotoPerfil !== "uploads/images.png") {
      const fs = require("fs");
      fs.unlinkSync(doador.fotoPerfil);
    }

    const deletedDoador = await Doador.findOneAndDelete({ _id: doadorId });

    emailController.sendEmail({
      subject: "Doador apagado!",
      text: `O doador ${deletedDoador.nome} ${deletedDoador.apelido}, registado com o email ${deletedDoador.email}, foi apagado da base de dados pelo administrador ${req.user.email}.`,
    });
    res.sendStatus(200);
  } catch (error) {
    console.error("Erro ao remover funcionário:", error);
    res.sendStatus(500);
  }
};

const exibirFormularioEdicao = async (req, res) => {
  try {
    const doador = await Doador.findById(req.params.id);
    res.render("doadores/editarDoador", { doador });
  } catch (error) {
    res.status(500).render("error", {
      message: "Ocorreu um erro ao exibir os fomulario de editação",
      error: error,
    });
  }
};

const editarDoador = async (req, res) => {
  const { id } = req.params;
  try {
    const { nome, apelido, email, nif, morada, contacto } = req.body;
    let novaFotoPerfil;

    const existingDoador = await Doador.findOne({ email: req.body.email });
    if (existingDoador && existingDoador._id.toString() !== id) {
      return res.status(400).json({ message: "O email já está em uso." });
    }

    const existingDoadorNif = await Doador.findOne({ nif: req.body.nif });
    if (existingDoadorNif && existingDoadorNif._id.toString() !== id) {
      return res.status(400).json({ message: "O NIF já está em uso." });
    }

    if (req.files && req.files["novafotoPerfil"]) {
      novaFotoPerfil = req.files["novafotoPerfil"][0].path;

      const doadorAntigo = await Doador.findById(id);
      if (doadorAntigo.fotoPerfil !== "uploads/images.png") {
        fs.unlinkSync(path.join(__dirname, "..", doadorAntigo.fotoPerfil));
      }
    }

    const updateData = {
      nome,
      apelido,
      email,
      nif,
      morada,
      contacto,
    };

    if (novaFotoPerfil) {
      updateData.fotoPerfil = novaFotoPerfil;
    }
    await Doador.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "Doador editado com sucesso." });
  } catch (error) {
    console.error("Erro ao editar funcionário:", error);
    res.status(500).json({
      message: "Ocorreu um erro ao editar o funcionário.",
    });
  }
};

async function getUser(email) {
  let user = await Funcionario.findOne({ email });
  if (user) return user;

  user = await Doador.findOne({ email });
  if (user) return user;

  user = await Entidade.findOne({ email });
  if (user) return user;

  return null;
}

async function getUser2(req, res, next) {
  try {
    const userEmail = req.user.email;
    console.log(userEmail);

    const user = await Doador.findOne({ email: userEmail });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Utilizador não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao procurar utilizador:", error);
    res
      .status(500)
      .json({ message: "Erro ao procurar utilizador", error: error.message });
  }
}

module.exports = {
  criarDoador,
  verTodosDoadores,
  removerDoador,
  exibirFormularioEdicao,
  editarDoador,
  criarDoador2,
  getUser2,
};
