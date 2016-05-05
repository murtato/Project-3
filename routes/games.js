var express = require('express');
var router = express.Router();

var gamesController = require("../controllers/games");


router.get(     '/',                  gamesController.index);
router.get(     '/:id',               gamesController.renderGame);
router.post(    '/',                  gamesController.create);
router.post(    '/join',              gamesController.join);
router.put(     '/:id',               gamesController.addInstruction);
router.put(     '/:id/startgame',     gamesController.startGame);
router.put(     '/:gameId/:instrId',  gamesController.deleteInstruction);
router.delete(  '/:id',               gamesController.destroy);



module.exports = router;
