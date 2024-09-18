var express = require('express');
var router = express.Router();
const multer = require('multer');
var funcionarioController = require('../controllers/funcionarioController');
const EntidadeBeneficiadora = require("../models/entidadeBeneficiadoraModel");
var entidadeBeneficiadoraController = require('../controllers/entidadeBeneficiadoraController');
var doadorController = require('../controllers/doadoresController');
var upload = multer({ dest: 'uploads/' });
var authController = require('../controllers/loginController');




router.get('/', async function(req, res, next) {
  const userRole = req.user.role;

  try {
      const numEntidadesPendentes = await EntidadeBeneficiadora.countDocuments({ status: 'em_espera' });

      res.render('users', { userRole: userRole, numEntidadesPendentes: numEntidadesPendentes });
  } catch (error) {
      console.error('Erro ao buscar entidades pendentes:', error);
      res.render('users', { userRole: userRole });
  }
});

router.get('/criar_funcionario', authController.checkRoles(['admin']), function(req, res, next) {
  res.render('forms/formFuncionario');
});

router.get('/criar_doador', function(req, res, next) {
  res.render('forms/formUser');
});

router.get('/criar_entidade', authController.checkRoles(['admin']), function(req, res, next) {
  res.render('forms/formEntidadeBeneficiadora');
});

router.get('/ver_todos_funcionarios', authController.checkRoles(['admin']), funcionarioController.verTodosFuncionarios);

router.get('/ver_todos_doadores', doadorController.verTodosDoadores);

router.delete('/remover_funcionario', authController.checkRoles(['admin']), funcionarioController.removerFuncionario);

router.delete('/remover_doador', doadorController.removerDoador);

router.get('/editar_funcionario/:id', authController.checkRoles(['admin']), funcionarioController.exibirFormularioEdicao);

router.get('/editar_doador/:id', doadorController.exibirFormularioEdicao);

router.put('/editar_funcionario/:id', authController.checkRoles(['admin']), funcionarioController.editarFuncionario);

router.put('/editar_doador/:id', upload.fields([{ name: 'novafotoPerfil'}]), doadorController.editarDoador);

router.post('/adicionar_funcionario', authController.checkRoles(['admin']), funcionarioController.criarFuncionario);

router.get('/ver_todas_entidades/:acao?', entidadeBeneficiadoraController.verTodasEntidades);

router.post('/remover_entidade', authController.checkRoles(['admin']), entidadeBeneficiadoraController.removerEntidade);

router.get('/editar_entidade/:id', authController.checkRoles(['admin']), entidadeBeneficiadoraController.exibirFormularioEdicao);

router.post('/editar_entidade/:id', authController.checkRoles(['admin']), upload.fields([{ name: 'novaFotoPerfil'}, {name: 'fotos'}]),entidadeBeneficiadoraController.editarEntidade);

router.post('/aceitar_entidade', authController.checkRoles(['admin']), entidadeBeneficiadoraController.aceitarEntidade);

router.post('/rejeitar_entidade', authController.checkRoles(['admin']), entidadeBeneficiadoraController.rejeitarEntidade);

module.exports = router;
