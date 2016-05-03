var Game = require("../models/game")


module.exports = {
  index:            index,
  show:             show,
  create:           create,
  join:             join,
  addInstruction:   addInstruction,
  destroy:          destroy
}

function index(req, res, next){
  console.log('index contoller function WORKED')
  Game.find({}, function(err, games){
    if(err) res.json(err);
    res.json(games)
  });
}

function show (req, res, next) {
  console.log("show controller")
  var id = req.params.id
  Game.find({_id: id}, function(err, game){
    if(err) res.json(err);
    res.json(game)
  });
}

function create (req, res, next) {
  console.log("create controller")
  var newGame = new Game();
  //the curr. user will be host of this game
  newGame.host_id = req.user._id

  newGame.save(function(err, savedGame){
    if(err) res.json(err);
    res.json(savedGame);
  });
}

function join(req, res, next) {
  console.log("join function is working")
  console.log(req.body.gameId)
  var id = req.body.gameId
  Game.findById(id, function(err, game){
    console.log(game)
    if(err || !game) {
      res.json(err);
    } else {
      game.player_ids = []
      game.player_ids.push(req.user._id)
      game.save(function (err, updatedGame) {
        if(err) res.json(err);
        res.json(updatedGame)
      })
    }
  });
}


function addInstruction(req, res, next){
  console.log("Adding Instruction controller")
  var id = req.params.id
  Game.findById(id, function(err, game){
    if(err || !game){
      res.json(err)
    }else{
      var instruction = {
        task: req.body.task,
        level: req.body.level
      }
      game.instructions.push(instruction)
      game.save(function(err, updatedGame){
        if(err) res.json(err)
        console.log('Added Instruction')
        res.json(updatedGame)
      })
    }
  })
}

function destroy(req, res, next){
    var id = req.params.id
  console.log("Deleting game", id)
  Game.remove({_id: id}, function(err, game){
    if(err) res.json(err)
    res.json({message: "Game deleted", _id: id})
  })
}






