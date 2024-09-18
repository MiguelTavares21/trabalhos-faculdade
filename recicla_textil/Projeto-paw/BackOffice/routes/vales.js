var express = require("express");
var router = express.Router();
const multer = require("multer");
var upload = multer({ dest: "uploads/" });
var valesController = require("../controllers/valesController");
var loginController = require("../controllers/loginController");

router.get("/", function (req, res, next) {
  const userRole = req.user.role;
  res.render("vales", {userRole: userRole});
});

router.post("/criarVale", upload.fields([{ name: 'fotos'}]), valesController.criarVale);

router.get("/deleteVales", valesController.renderDeleteVales);

router.delete("/delete_vale/:id", valesController.deleteVale);

module.exports = router;
