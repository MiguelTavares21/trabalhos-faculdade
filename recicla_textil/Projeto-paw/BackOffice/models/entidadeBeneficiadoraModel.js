const mongoose = require("mongoose");

const entidadeBeneficiadoraSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Validação de formato de email utilizando expressão regular
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Por favor, insira um email válido",
        ],
    },
    contacto: {
        type: String,
        required: true,
        // Validação de formato de número de telefone utilizando expressão regular
        match: [
            /^[9][0-9]{8}$/,
            "Por favor, insira um número de telefone válido",
        ],
    },
    numeroDoacoes: {
        type: Number,
        default: 0,
    },
    morada: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    doacoesPorValidar: [{
        type: String,
    }],
    doacoesValidadas: [{
        type: String,
    }],
    fotoPerfil: {
        type: String,
        required: true,
        maxItems: 1,
    },
    fotos: [{
        type: String,
        required: true,
    }],
    status: {
        type: String,
        enum: ['aceite', 'rejeitada', 'em_espera'],
        default: 'em_espera'
    },
    role: {
        type: String,
        default: "entidade",
    },
});

const EntidadeBeneficiadora = mongoose.model("EntidadeBeneficiadora", entidadeBeneficiadoraSchema);
module.exports = EntidadeBeneficiadora;
