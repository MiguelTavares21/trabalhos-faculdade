var express = require("express");
var router = express.Router();
var requestsController = require("../controllers/requestsController");
var Requests = require("../models/requestsModel");
const multer = require('multer');
var upload = multer({ dest: 'uploads/' });


/* GET home page. */
router.get('/', function(req, res, next) {
  const userRole = req.user.role;
  Requests.find()
  .then(function (requests) {
    if (!requests) {
      res.render("requests");
    }
    res.render("requests", { pedidos: requests, userRole: userRole });
  })
  .catch(function (err) {
    console.log("Error:", err);
    return;
  });
});

router.get('/criarPedido', requestsController.criarPedidoRecolhaForm);
router.post('/criarPedidoRecolha', upload.fields([{ name: 'fotos'}]), requestsController.criarRequests)
router.get('/updateRequest/:id', requestsController.editarRequestForm)
router.put('/editar_request/:id', requestsController.editarRequest);
router.get("/criarPedidoRecolha/:id", requestsController.mostrarRequest);

module.exports = router;