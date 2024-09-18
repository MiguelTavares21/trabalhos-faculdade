const mongoose = require('mongoose');
const doadorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  apelido: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Por favor, insira um email válido",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  nif: {
    type: String,
    unique: true,
    required: true,
    match: [/^[0-9]{9}$/, "O NIF deve conter exatamente 9 dígitos."],
  },
  morada: {
    type: String,
    required: true,
  },
  contacto: {
    type: String,
    match: [/^[9][0-9]{8}$/, "Por favor, insira um número de telefone válido"],
  },
  numeroPontos: {
    type: Number,
    default: 0,
  },
  numeroDoacoes: {
    type: Number,
    default: 0,
  },
  doacoes: [
    {
      type: String,
    },
  ],
  data: {
    type: Date,
    default: Date.now,
  },
  fotoPerfil: {
    type: String,
    maxItems: 1,
  },
  role: {
    type: String,
    default: "doador",
  },
  codigoAngariador: {
    type: String,
    unique: true,
    required: true,
  },
  codigoAngariadorConvidado: {
    type: String,
    required: true,
    default: "Sem código",
  },
  doacoesAngariadas: [
    {
      type: String,
    },
  ],
});

const Doador = mongoose.model('Doadores', doadorSchema);

module.exports = Doador;