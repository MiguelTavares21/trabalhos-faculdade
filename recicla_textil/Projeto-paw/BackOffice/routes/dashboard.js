var express = require('express');
var router = express.Router();
var requestsController = require('../controllers/requestsController');

/* GET home page. */
router.get('/', function(req, res, next) {
  const userRole = req.user.role;
  res.render('dashboard', {userRole: userRole});
});

router.get('/pedidosPorMes', requestsController.getPedidosPorMes);

module.exports = router;