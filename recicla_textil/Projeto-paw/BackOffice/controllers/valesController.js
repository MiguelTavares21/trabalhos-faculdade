const Vales = require("../models/valesModel");
const emailController = require("../controllers/emailController");
const Doadores = require("../models/doadorModel");
const fs = require("fs");
const path = require("path");

const criarVale = async (req, res) => {
  try {
    let imagens = [];
    if (req.files && req.files["fotos"]) {
      imagens = req.files["fotos"].map((file) => file.path);
    }

    let createdVale = new Vales({
      ...req.body,
      fotos: imagens,
    });

    let error = createdVale.validateSync();

    if (error) {
      console.log(error);
      return res.status(400).render("error", {
        message: "Erro de validação",
        error: error.message,
      });
    }
    createdVale = await createdVale.save();
    emailController.sendEmail({
      subject: "Vale criado!",
      text: `Um vale foi criado com sucesso pelo admin "${req.user.email}."`,
    });
    console.log("Vale creado com sucesso" + createdVale);
    res.redirect("/vales");
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar vale" });
  }
};

const renderDeleteVales = async (req, res) => {
  try {
    const vales = await Vales.find();
    res.render("apagarVales", { vales });
  } catch (error) {
    res.status(500).render("error", {
      message: "Ocorreu um erro ao exibir o fomulario de deleteVales",
      error: error,
    });
  }
};

const deleteVale = async (req, res) => {
  const { id } = req.params;
  try {
    const vale = await Vales.findById(id);

    if (!vale) {
      return res.status(404).json({ message: "Vale não encontrado" });
    }

    if (vale.fotos) {
      try {
        const fotos = Array.isArray(vale.fotos) ? vale.fotos : [vale.fotos];
        fotos.forEach((foto) => {
          const imagePath = path.resolve(__dirname, '..', foto);
          fs.unlinkSync(imagePath);
        });
      } catch (err) {
        console.error("Erro ao deletar a imagem:", err);
        return res.status(500).json({ message: "Erro ao deletar a imagem", error: err.message });
      }
    }

    await Vales.findByIdAndDelete(id);

    res.status(200).json({ message: "Vale eliminado com sucesso" });
  } catch (error) {
    console.error("Erro ao eliminar o vale:", error);
    res.status(500).json({
      message: "Ocorreu um erro ao eliminar o vale",
      error: error.message,
    });
  }
};

const getVales2 = async (req, res) => {
  try {
    const vales = await Vales.find();
    res.status(201).json({ vales });
  } catch (error) {
    res.status(500).json({
      message: "Ocorreu um erro ao listar os vales",
      error: error.message,
    });
  }
};

const resgatarVales2 = async (req, res) => {
  try {
    const { idVale } = req.body;
    console.log(idVale);
    const donatorEmail = req.user.email;
    const donator = await Doadores.findOne({ email: donatorEmail });
    const vale = await Vales.findById(idVale);

    if (donator.numeroPontos < vale.custoPontos) {
      throw new Error(
        "O doador não possui pontos suficientes para resgatar este vale"
      );
    } else {
      donator.numeroPontos -= vale.custoPontos;
      vale.numeroResgates += 1;
    }

    await donator.save();
    await vale.save();

    res.status(201).json({ message: "Vale resgatado com sucesso" });
  } catch (error) {
    res.status(500).json({
      message: "Ocorreu um erro ao resgatar o vale",
      error: error.message,
    });
  }
};

module.exports = {
  criarVale,
  getVales2,
  resgatarVales2,
  renderDeleteVales,
  deleteVale
};
