const EntidadeBeneficiadora = require("../models/entidadeBeneficiadoraModel");
const Doador = require('../models/doadorModel');
const Funcionario = require('../models/funcionarioModel');
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const emailController = require("../controllers/emailController")

const criarEntidadeBeneficiadora = async (req, res) => {
  try {
    const user = await getUser(req.body.email);

    if (user) {
      if (req.files && req.files["fotoPerfil"]) {
        fs.unlinkSync(req.files["fotoPerfil"][0].path);
      }
      if (req.files && req.files["fotos"]) {
        req.files["fotos"].forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }
        return res.render("error", {
            message: "Email já está a ser utilizado",
            error: "Email já está a ser utilizado",
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
    }

    const fotoPerfil = req.files["fotoPerfil"][0].path;
    let fotos = [];
    if (req.files["fotos"]) {
      fotos = req.files["fotos"].map((file) => file.path);
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const entidadeBeneficiadora = new EntidadeBeneficiadora({
      nome: req.body.nome,
      email: req.body.email,
      contacto: req.body.contacto,
      morada: req.body.morada,
      descricao: req.body.descricao,
      password: hashedPassword,
      fotoPerfil: fotoPerfil,
      fotos: fotos,
    });

    let error = entidadeBeneficiadora.validateSync();
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    await entidadeBeneficiadora.save();

    emailController.sendEmail({
      subject: `${req.body.nome} está à espera de validação`,
      text: `A entidade "${req.body.nome}" está na fila de espera para ser validada.`,
    });

    res.render("entidades/entidadeCreated", {
      entidade: entidadeBeneficiadora,
    });
  } catch (error) {
    res.status(500).render("error", {
      message: "Ocorreu um erro ao criar Entidade",
      error: error,
    });
  }
};

const verTodasEntidades = async (req, res) => {
  try {
    const userRole = req.user.role;
      const acao = req.params.acao || 'ver_todas';
      let entidades;

      if (acao === 'aceitar_rejeitar') {
          entidades = await EntidadeBeneficiadora.find({ status: 'em_espera' });
      } else if (acao === 'ver_rejeitadas') {
          entidades = await EntidadeBeneficiadora.find({ status: 'rejeitada' });
      } else {
          entidades = await EntidadeBeneficiadora.find({ status: 'aceite' });
      }

      res.render("entidades/verTodasEntidades", { entidades, acao, userRole });

  } catch (error) {
      res.status(500).render("error", {
          message: "Ocorreu um erro ao listar as entidades",
          error: error,
      });
  }
};


const verTodasEntidades2 = async (req, res) => {
  try {
    const entidades = await EntidadeBeneficiadora.find({ status: "aceite" });
    console.log("entrei aqui");
    res.status(201).json({ entidades });
  } catch (error) {
    res.status(500).json({
      message: "Ocorreu um erro ao listar as entidades",
      error: error.message,
    });
  }
};



const removerEntidade = async (req, res) => {
  const { entidadeId } = req.body;
  try {
    const entidade = await EntidadeBeneficiadora.findById(entidadeId);
    if (!entidade) {
      res.status(500).render("error", {
        message: "Entidade não encontrada",
        error: "Entidade não encontrada",
      });
    }
    
    const fotos = [entidade.fotoPerfil, ...entidade.fotos];
    
    await EntidadeBeneficiadora.findByIdAndDelete(entidadeId);

    fotos.forEach((foto) => {
      const imagePath = path.resolve(__dirname, '..', foto);
      fs.unlinkSync(imagePath);
    });
    res.redirect("/users");
  } catch (error) {
    res.status(500).render("error", {
      message: "Ocorreu um erro ao remover a entidade",
      error: error,
    });
  }
};

const exibirFormularioEdicao = async (req, res) => {
  try {
      const entidade = await EntidadeBeneficiadora.findById(req.params.id);
      if (!entidade) {
          return res.status(404).render("error", {
              message: "Entidade não encontrada",
              error: "A entidade com o ID fornecido não existe.",
          });
      }
      
      res.render("entidades/editarEntidade", { entidade });
  } catch (error) {
      res.status(500).render("error", {
          message: "Ocorreu um erro ao editar a entidade",
          error: error,
      });
  }
};


const editarEntidade = async (req, res) => {
  const { id } = req.params;
  try {
    const { nome, descricao, email, contacto, morada, fotosRemovidas } = req.body;
    let novaFotoPerfil;

    if (req.files && req.files["novaFotoPerfil"]) {
      novaFotoPerfil = req.files["novaFotoPerfil"][0].path;

      const entidadeAntiga = await EntidadeBeneficiadora.findById(id);
      if (entidadeAntiga.fotoPerfil) {
        fs.unlinkSync(path.join(__dirname, '..', entidadeAntiga.fotoPerfil));
      }
    }

      const fotosAdicionais = req.files["fotos"];
      const fotos = [];

      if (fotosAdicionais && fotosAdicionais.length > 0) {
          fotosAdicionais.forEach(foto => {
              const fotoPath = foto.path;
              fotos.push(fotoPath);
          });
      }


    const updateData = {
      nome,
      descricao,
      email,
      contacto,
      morada,
    };

    if (novaFotoPerfil) {
      updateData.fotoPerfil = novaFotoPerfil;
    }

    if (fotos.length > 0) {
      updateData.$push = { fotos: { $each: fotos } };
    }

// Remover fotos adicionais da base de dados
if (typeof fotosRemovidas === 'string'  && fotosRemovidas.trim() !== '') {
  // Converter fotosRemovidas para array
  const fotosRemovidasArray = JSON.parse(fotosRemovidas);
  
  if (fotosRemovidasArray.length > 0) {
    await EntidadeBeneficiadora.findByIdAndUpdate(id, {
      $pull: { fotos: { $in: fotosRemovidasArray } }
    });

    // Remover fotos da pasta de uploads
    fotosRemovidasArray.forEach(foto => {
      const fotoPath = path.join(__dirname, '..', foto);
      fs.unlinkSync(fotoPath);
    });
  }
}



  
      await EntidadeBeneficiadora.findByIdAndUpdate(id, updateData);

    res.redirect("/users");
  } catch (error) {
    res.status(500).render("error", {
      message: "Ocorreu um erro ao editar a entidade",
      error: error,
    });
  }
};

const aceitarEntidade = async (req, res) => {
  const { entidadeId } = req.body;
  try {
    const entidade = await EntidadeBeneficiadora.findById(entidadeId);
    if (!entidade) {
      return res.status(404).json({ error: "Entidade não encontrada" });
    }

    entidade.status = 'aceite';
    await entidade.save();

    emailController.sendEmail({
      subject: `${entidade.nome} foi validada`,
      text: `A entidade "${entidade.nome}" foi validada pelo admin ${req.user.email}.`,
    });

    res.redirect("/users");
  } catch (error) {
    res.status(500).render("error", {
      message:"Ocorreu um erro ao aceitar a entidade",
      error: error,
    });
  }
};

const rejeitarEntidade = async (req, res) => {
  const { entidadeId } = req.body;
  try {
    const entidade = await EntidadeBeneficiadora.findById(entidadeId);
    if (!entidade) {
      return res.status(404).json({ error: "Entidade não encontrada" });
    }

    entidade.status = 'rejeitada';
    await entidade.save();

    emailController.sendEmail({
      subject: `${entidade.nome} foi rejeitada`,
      text: `A entidade "${entidade.nome}" foi rejeitada pelo admin ${req.user.email}.`,
    });


    res.redirect("/users");
  } catch (error) {
    res.status(500).render("error", {
      message:"Ocorreu um erro ao rejeitar a entidade",
      error: error,
    });
  }
};

async function getUser(email) {
  let user = await Funcionario.findOne({ email });
  if (user) return user;

  user = await Doador.findOne({ email });
  if (user) return user;

  user = await EntidadeBeneficiadora.findOne({ email });
  if (user) return user;

  return null;
}

const criarEntidadeBeneficiadora2 = async (req, res) => {
  try {
    const existingUser = await getUser(req.body.email);
    if (existingUser) {
      throw new Error("O email já se encontra em uso");
    }

    const existingName = await EntidadeBeneficiadora.findOne({ nome: req.body.nome });
    if (existingName) {
      throw new Error("O nome já se encontra em uso");
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
    }

    const fotoPerfil = req.files["fotoPerfil"][0].path;
    let fotos = [];
    if (req.files["fotos"]) {
      fotos = req.files["fotos"].map((file) => file.path);
    }

  
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const entidadeBeneficiadora = new EntidadeBeneficiadora({
      nome: req.body.nome,
      email: req.body.email,
      contacto: req.body.contacto,
      morada: req.body.morada,
      descricao: req.body.descricao,
      password: hashedPassword,
      fotoPerfil: fotoPerfil,
      fotos: fotos,
    });

    let error = entidadeBeneficiadora.validateSync();
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    await entidadeBeneficiadora.save();

    emailController.sendEmail({
      subject: `${req.body.nome} está à espera de validação`,
      text: `A entidade "${req.body.nome}" está na fila de espera para ser validada.`,
    });


    res.status(201).json({ message: "Entidade criada com sucesso", entidade: entidadeBeneficiadora });
  } catch (error) {
    if (req.files && req.files["fotoPerfil"]) {
      fs.unlinkSync(req.files["fotoPerfil"][0].path);
    }
    if (req.files && req.files["fotos"]) {
      req.files["fotos"].forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }
    res.status(500).json({
      message: "Ocorreu um erro ao adicionar a entidade",
      error: error.message,
  });
  }
};

async function getEntity(req, res, next){
  try {
      const entidadeEmail = req.user.email;
      console.log(entidadeEmail);

      const entidade = await EntidadeBeneficiadora.findOne({ email: entidadeEmail });

      if (entidade) {
          res.status(200).json(entidade);
      } else {
          res.status(404).json({ message: 'Entidade não encontrada' });
      }
  } catch (error) {
      console.error('Erro ao procurar entidaed:', error);
      res.status(500).json({ message: 'Erro ao procurar entidade', error: error.message });
  }
}




module.exports = {
  criarEntidadeBeneficiadora,
  verTodasEntidades,
  removerEntidade,
  exibirFormularioEdicao,
  editarEntidade,
  aceitarEntidade,
  rejeitarEntidade,
  criarEntidadeBeneficiadora2,
  verTodasEntidades2,
  getEntity
};
