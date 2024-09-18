const Funcionario = require("../models/funcionarioModel");
const Entidade = require('../models/entidadeBeneficiadoraModel');
const Doador = require("../models/doadorModel");
const bcrypt = require("bcryptjs");
const emailController = require("../controllers/emailController")

const criarFuncionario = async (req, res) => {
    try {
        const user = await getUser(req.body.email);

        if (user) {
            return res.render("error", {
                message: "Email já está a ser utilizado",
                error: "Email já está a ser utilizado",
            });
        }

        const admin = req.body.admin === "on" ? true : false;

        delete req.body.admin;

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let numeroEmpresa;
        let funcionarioExistente;

        do {
            numeroEmpresa = Math.floor(Math.random() * 10000);
            funcionarioExistente = await Funcionario.findOne({ numero_empresa: numeroEmpresa });
        } while (funcionarioExistente);


        var roleCreate;
        if(admin === true){
            roleCreate = "admin";
        }else{
            roleCreate = "funcionario";
        }

        const funcionario = new Funcionario({
            ...req.body,
            admin,
            password: hashedPassword,
            role: roleCreate,
            numero_empresa: numeroEmpresa
        });


        await funcionario.validate();

        await funcionario.save();

        emailController.sendEmail({
            subject: "Funcionário registado!",
            text: `O funcionário ${funcionario.nome} ${funcionario.apelido}, número ${funcionario.numero_empresa}, que desempenha o cargo de ${funcionario.role} foi registado com o email ${funcionario.email}.`,
          });

    res.render("funcionarios/funcionarioCreated", {
        nome: funcionario.nome,
        apelido: funcionario.apelido,
        email: funcionario.email,
        numero_empresa: funcionario.numero_empresa,
        contacto: funcionario.contacto,
        morada: funcionario.morada,
    });
    } catch (error) {
        res.status(500).render("error", {
            message: "Ocorreu um erro ao criar o funcionário",
            error: error,
        });
    }
};

const verTodosFuncionarios = async (req, res) => {
    try {
        const funcionarios = await Funcionario.find();
        res.render("funcionarios/verTodosFuncionarios", { funcionarios });
    } catch (error) {
        res.status(500).render("error", {
            message: "Ocorreu um erro ao procurar os funcionários",
            error: error,
        });
    }
};

const removerFuncionario = async (req, res) => {
    const { funcionarioId } = req.body;
    const { user } = req;
    try {
        if (funcionarioId === user._id) {
            return res.status(400).json({ message: "Você não pode remover a si mesmo." });
        }
        const funcionario = await Funcionario.findByIdAndDelete(funcionarioId);
        emailController.sendEmail({
            subject: "Funcionário eliminado!",
            text: `O funcionário ${funcionario.nome} ${funcionario.apelido}, número ${funcionario.numero_empresa}, que desempenha o cargo de ${funcionario.role} foi apagado da base de dados pelo administrador ${req.user.email}.`,
          });
        res.sendStatus(200);
    } catch (error) {
        console.error('Erro ao remover funcionário:', error);
        res.sendStatus(500);
    }
};


const exibirFormularioEdicao = async (req, res) => {
    try {
        const funcionario = await Funcionario.findById(req.params.id);
        res.render("funcionarios/editarFuncionario", { funcionario, userLogged: req.user  });
    } catch (error) {
        res.status(500).render("error", {
            message: "Ocorreu um erro ao editar o funcionário",
            error: error,
        });
    }
};

const editarFuncionario = async (req, res) => {
    const { id } = req.params;
    try {

        const existingFuncionario = await Funcionario.findOne({ email: req.body.email });
        if (existingFuncionario && existingFuncionario._id.toString() !== id) {
            return res.status(400).json({ message: "O email já está em uso." });
        }

        const roleUpdate = req.body.admin ? "admin" : "funcionario";
        const updatedFuncionarioData = {
            ...req.body,
            role: roleUpdate
        };

        const updatedFuncionario = await Funcionario.findOneAndUpdate({ _id: id }, updatedFuncionarioData, {
            new: true,
            runValidators: true
        });

        if (!updatedFuncionario) {
            return res.status(404).json({ message: "Funcionário não encontrado." });
        }

        res.status(200).json({ message: "Funcionário editado com sucesso."});
    } catch (error) {
        console.error("Erro ao editar funcionário:", error);
        res.status(500).json({ message: "Ocorreu um erro ao editar o funcionário." });
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
  
  

module.exports = {
    criarFuncionario,
    verTodosFuncionarios,
    removerFuncionario,
    exibirFormularioEdicao,
    editarFuncionario,
};
