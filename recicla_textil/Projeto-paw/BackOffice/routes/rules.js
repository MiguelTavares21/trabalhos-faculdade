var express = require("express");
var router = express.Router();
var rulesController = require("../controllers/rulesController");
var Rules = require("../models/rulesModel");

router.get("/", function (req, res, next) {
  const userRole = req.user.role;
  Rules.findOne({_id: "661d4d0a93b3907303e6c970"})
    .then(function (rules) {
      if (!rules) {
        console.log("Sem regras registadas");
        return res.status(404).send("Sem regras registadas");
      }
      res.render("rules", { rules: rules,  userRole: userRole});
    })
    .catch(function (err) {
      console.log("Error:", err);
      return;
    });
});

router.put("/editar_regras", rulesController.editarRegras);

module.exports = router;
