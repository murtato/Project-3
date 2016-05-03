var express = require('express');
var router = express.Router();

var gamesController = require("../controllers/games");

router.get(     '/',       gamesController.index);
router.get(     '/:id',    gamesController.show);
router.post(    '/',       gamesController.create);
router.put(     '/:id',    gamesController.addInstruction);
router.delete(  '/:id',    gamesController.destroy);

module.exports = router;
