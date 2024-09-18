const mongoose = require("mongoose");

const funcionarioSchema = new mongoose.Schema({
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
        // Validação de formato de email utilizando expressão regular
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Por favor, insira um email válido",
        ],
    },
    numero_empresa: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    contacto: {
        type: String,
        required: true,
        match: [
            /^[9][0-9]{8}$/,
            "Por favor, insira um número de telefone válido",
        ],
    },
    morada: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['funcionario', 'admin'],
        default: "funcionario",
    }, getsEmails: {
        type: Boolean,
        default: false,
    }
});

const Funcionario = mongoose.model("Funcionario", funcionarioSchema);
module.exports = Funcionario;