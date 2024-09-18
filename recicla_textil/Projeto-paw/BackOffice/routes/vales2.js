var express = require("express");
var router = express.Router();
const multer = require("multer");
var upload = multer({ dest: "uploads/" });
var valesController = require("../controllers/valesController");
var loginController = require("../controllers/loginController");

router.get(
  "/verVales2",
  loginController.verifyLoginUser2,
  valesController.getVales2
);

router.put(
  "/resgatarVales2",
  loginController.verifyLoginUser2,
  valesController.resgatarVales2
);

module.exports = router;
