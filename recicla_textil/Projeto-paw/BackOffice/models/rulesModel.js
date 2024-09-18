const mongoose = require("mongoose");

const rulesSchema = new mongoose.Schema({
  pontosPorKilo: {
    type: Number,
    required: true,
    min: 0,
  },
  pontosPorPecaAdulto: {
    type: Number,
    required: true,
    min: 0,
  },
  pontosPorPecaCrianca: {
    type: Number,
    required: true,
    min: 0,
  },
  pontosPorPecaAdolescente: {
    type: Number,
    required: true,
    min: 0,
  },
  pontosPorTipoInterior: {
    type: Number,
    required: true,
    min: 0,
  },
  pontosPorTipoInferior: {
    type: Number,
    required: true,
    min: 0,
  },
  pontosPorTipoTronco: {
    type: Number,
    required: true,
    min: 0,
  },
  pontosPorTipoCalcado: {
    type: Number,
    required: true,
    min: 0,
  },
  pontosPorEstadoRoupaNovo: {
    type: Number,
    required: true,
    min: 0,
  },
  pontosPorEstadoRoupaSemiNovo: {
    type: Number,
    required: true,
    min: 0,
  },
  pontosPorEstadoRoupaUsado: {
    type: Number,
    required: true,
    min: 0,
  },
  data: {
    type: Date,
    default: Date.now,
  },
  pontosCodigo: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Rules = mongoose.model("Rules", rulesSchema);
module.exports = Rules;