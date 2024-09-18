var express = require('express');
var router = express.Router();
var authController = require('../controllers/loginController');
var funcionarioController = require('../controllers/funcionarioController');
const myDataController = require('../controllers/myDataController')
const multer = require('multer');

router.get('/', myDataController.displayForm);

router.put('/edit', myDataController.editData);

module.exports = router;