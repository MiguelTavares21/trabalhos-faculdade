const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Por favor, insira um email válido",
    ],
  },
  pecasCrianca: {
    type: Number,
    required: true,
    min: 0,
  },
  pecasAdulto: {
    type: Number,
    required: true,
    min: 0,
  },
  pecasAdolescente: {
    type: Number,
    required: true,
    min: 0,
  },
  numeroPecas: {
    type: Number,
    default: function () {
      return this.pecasCrianca + this.pecasAdulto + this.pecasAdolescente;
    },
  },
  pecasTipoInterior: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (v) {
        return (
          v +
            this.pecasTipoInferior +
            this.pecasTipoCalcado +
            this.pecasTipoTronco ==
          this.numeroPecas
        );
      },
      message: (props) =>
        `A soma das peças de diferentes tipos tem que ser igual ao número total de peças (${this.numeroPecas})`,
    },
  },
  pecasTipoTronco: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (v) {
        return (
          v +
            this.pecasTipoInferior +
            this.pecasTipoCalcado +
            this.pecasTipoInterior ==
          this.numeroPecas
        );
      },
      message: (props) =>
        `A soma das peças de diferentes tipos tem que ser igual ao número total de peças (${this.numeroPecas})`,
    },
  },
  pecasTipoInferior: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (v) {
        return (
          v +
            this.pecasTipoInterior +
            this.pecasTipoCalcado +
            this.pecasTipoTronco ==
          this.numeroPecas
        );
      },
      message: (props) =>
        `A soma das peças de diferentes tipos tem que ser igual ao número total de peças (${this.numeroPecas})`,
    },
  },
  pecasTipoCalcado: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (v) {
        return (
          v +
            this.pecasTipoInferior +
            this.pecasTipoInterior +
            this.pecasTipoTronco ==
          this.numeroPecas
        );
      },
      message: (props) =>
        `A soma das peças de diferentes tipos tem que ser igual ao número total de peças (${this.numeroPecas})`,
    },
  },
  entidade: {
    type: String,
    required: true,
  },
  kilos: {
    type: Number,
    required: true,
    min: 0.1,
  },
  pontos: {
    type: Number,
    default: 0,
  },
  data: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const today = new Date();
        return value.getDay() >= today.getDay();
      },
      message: "A data deve ser estabelicida após hoje",
    },
  },
  estado: {
    type: String,
    enum: [
      "Agendado",
      "Por iniciar",
      "Aprovado",
      "A realizar",
      "Validado",
      "Cancelado",
    ],
    default: "Agendado",
  },
  fotos: [
    {
      type: String,
      required: true,
    },
  ],
  estadoRoupa: {
    type: String,
    enum: ["Novo", "Semi-Novo", "Usado"],
    default: "Usado",
  },
  codigoAngariador: {
    type: String,
  },
});

const Requests = mongoose.model("Requests", requestSchema);
module.exports = Requests;
