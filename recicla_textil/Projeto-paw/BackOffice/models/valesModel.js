const mongoose = require("mongoose");

const valeSchema = new mongoose.Schema({
  empresa: {
    type: String,
    required: true,
  },
  custoPontos: {
    type: Number,
    required: true,
    min: 0,
  },
  numeroResgates: {
    type: Number,
    default: 0,
  },
  descricao: {
    type: String,
    required: true,
  },
  fotos: [
    {
      type: String,
      required: true,
    },
  ],
});

const vales = mongoose.model("vale", valeSchema);
module.exports = vales;
