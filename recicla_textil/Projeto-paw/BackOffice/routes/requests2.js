var express = require("express");
var router = express.Router();
var requestsController = require("../controllers/requestsController");
var Requests = require("../models/requestsModel");
const multer = require("multer");
var loginController = require("../controllers/loginController");
var upload = multer({ dest: "uploads/" });


router.post(
  "/criarPedidoRecolha2",
  upload.fields([{ name: "fotos" }]), loginController.verifyLoginUser2,
  requestsController.criarRequests2
);

router.get(
  "/pedidos",
  loginController.verifyLoginUser2,
  requestsController.getPedidos2
);

router.put(
  "/atualizarEstadoDoacao",
  loginController.verifyLoginUser2,
  requestsController.updateDoacaoState2
);

module.exports = router;
