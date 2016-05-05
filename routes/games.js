var express = require('express');
var router = express.Router();

var gamesController = require("../controllers/games");


router.get(     '/',                  gamesController.index);
router.get(     '/status/:id',        gamesController.status);
router.get(     '/:id',               gamesController.renderGame);
router.get(     '/:id/json',          gamesController.show);
router.post(    '/',                  gamesController.create);
router.post(    '/join',              gamesController.join);
router.put(     '/:id/instruction',   gamesController.addInstruction);
router.put(     '/:gameId/instruction/:instrId',  gamesController.deleteInstruction);
router.put(     '/:id/startgame',     gamesController.startGame);
router.put(     '/:id/photo',         gamesController.addPhoto)
router.delete(  '/:id',               gamesController.destroy);



module.exports = router;
