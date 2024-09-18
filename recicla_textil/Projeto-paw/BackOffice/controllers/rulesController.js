const Rules = require("../models/rulesModel");
const emailController = require("../controllers/emailController")

var rulesController = {};

const editarRegras = async (req, res) => {
  try {
    const updatedRules = {
      ...req.body,
      data: new Date(),
    };
    const updatedDoc = await Rules.findOneAndUpdate({}, updatedRules, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc) {
      return res.status(500).json({ message: "Ocorreu um erro ao editar o pedido." });
    }
    emailController.sendEmail({
      subject: "As regras foram atualizadas!",
      text: `Regras atualizadas com sucesso pelo admin "${req.user.email}."`,
    });
    
    res.status(200).json({ message: "Regras atualizadas com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao editar as regras" });
  }
};

module.exports = { editarRegras };
