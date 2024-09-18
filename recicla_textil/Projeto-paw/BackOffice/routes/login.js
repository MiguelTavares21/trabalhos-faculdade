var express = require('express');
var router = express.Router();
var authController = require('../controllers/loginController');
var doadorController = require('../controllers/doadoresController');
var entidadeBeneficiadoraController = require('../controllers/entidadeBeneficiadoraController');
const multer = require('multer');
var upload = multer({ dest: 'uploads/' });

router.get('/', authController.verifyLoginUser, authController.checkRoles(['admin', 'funcionario']), function(req, res, next) {
  const userRole = req.user.role;
  res.render('index', {userRole: userRole});
});

router.get('/login', authController.renderLoginPage);

router.post('/login', authController.submittedLogin);

router.post('/login2', authController.submittedLogin2); 

router.get('/logout', authController.logout);

router.get('/createUser', function(req, res, next) {
  res.render('forms/formUser');
});

router.get('/createEntity', function(req, res, next) {
  res.render('forms/formEntidadeBeneficiadora');
});

router.post('/adicionar_doador', upload.fields([{ name: 'fotoPerfil'}]), doadorController.criarDoador);

router.post(
  "/adicionar_doador2",
  upload.fields([{ name: "fotoPerfil" }]),
  doadorController.criarDoador2
);

router.post('/adicionar_entidade', upload.fields([{ name: 'fotoPerfil'}, { name: 'fotos'}]), entidadeBeneficiadoraController.criarEntidadeBeneficiadora);

router.post(
  "/adicionar_entidade2",
  upload.fields([{ name: "fotoPerfil" }, { name: "fotos" }]),
  entidadeBeneficiadoraController.criarEntidadeBeneficiadora2
);

module.exports = router;
