var express = require("express");
var router = express.Router();
const multer = require("multer");
var upload = multer({ dest: 'uploads/' });
var entidadeBeneficiadoraController = require("../controllers/entidadeBeneficiadoraController");
var loginController = require("../controllers/loginController")
var doadorController = require("../controllers/doadoresController")
const myDataController = require('../controllers/myDataController')

router.get(
  "/ver_todas_entidades2",
  loginController.verifyLoginUser2,
  entidadeBeneficiadoraController.verTodasEntidades2
);

router.get(
  "/getUser", loginController.verifyLoginUser2,
  doadorController.getUser2
)

router.put(
  "/editarUser", upload.fields([{ name: 'fotoPerfil'}]),
  loginController.verifyLoginUser2,
  myDataController.editDoador
)

router.get(
  "/getEntity", loginController.verifyLoginUser2,
  entidadeBeneficiadoraController.getEntity
)

router.put(
  "/updateEntity", upload.fields([{ name: 'fotoPerfil'}, {name:'outrasFotos'}]),
  loginController.verifyLoginUser2,
  myDataController.editEntidade
)



module.exports = router;