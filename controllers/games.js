var Game = require("../models/game")
var User = require("../models/user")

module.exports = {
  create:             create,
  join:               join,
  index:              index,
  renderGame:         renderGame,
  startGame:          startGame,
  addInstruction:     addInstruction,
  deleteInstruction:  deleteInstruction,
  destroy:            destroy
}

function create (req, res, next) {
  console.log("create controller")

  // if not logged in, log in
  if (!req.user) {
    console.log("please log in")
    res.redirect('/auth/google')
  // else try to create game
  } else {
    // check if user already is part of a game
    var currentGame = req.user.currentGame
    if (currentGame) {
      console.log("redirecting to game", currentGame)
      res.redirect('/api/games/'+currentGame)
      // go ahead and create a game
    } else {

      User.findById(req.user.id, function(err, user) {
        var newGame = new Game();
        //the curr. user will be host of this game
        newGame.host_id = user._id
        newGame.save(function(err, savedGame){
          if(err) res.json(err);
          user.currentGame = savedGame._id
          user.save(function (err, savedUser) {
            if (err) res.json(err)

            res.redirect('/api/games/'+savedUser.currentGame)
          })
        });
      })
    }
  }
}

function join(req, res, next) {
  console.log("join function is working")
  if(!req.user){
    console.log("you have to be logged in")
    res.redirect('/auth/google')
  } else {
    if (req.user.currentGame) {
      res.redirect('/api/games/'+req.user.currentGame)
      console.log("you're already a player of this game, here's the game again")
    } else  {
      var userId = req.user._id
      var gameId = req.body.gameId

      Game.findById(gameId, function(err, game){
        if(err || !game) {
          res.json(err);
        } else {
          // add current user to game and game to user
          game.player_ids.push(userId)
          game.save(function (err, updatedGame) {
            if(err) res.json(err);
            User.findById(userId, function(err, user) {
              console.log("added you to the game, here's the game")
              user.currentGame = updatedGame._id
              res.redirect('/api/games/'+updatedGame._id)
            })
          })
        }
      })
    }
  }
}

function index(req, res, next){
  console.log('index contoller function WORKED')
  Game.find({}, function(err, games){
    if(err) res.json(err);
    res.json(games)
  });
}

function renderGame (req, res, next) {
  if(!req.user){
    console.log("you have to be logged in")
    res.redirect('/auth/google')
  } else {
    console.log("show controller worked")
    var id = req.params.id

    Game.findById(id, function(err, game){
      if(err) res.json(err);

      if (game.host_id == req.user.id){
        res.render('game/host', {game: game, user: req.user})
      } else {
        res.render('game/player', {game: game, user: req.user})
      }
    });
  }
}


function addInstruction(req, res, next){
  console.log("Adding Instruction controller")
  var id = req.params.id
  Game.findById(id, function(err, game){
    if(err || !game){
      res.json(err)
    }else{
      var instruction = {}

      console.log(req.body)

      if(req.body.task) instruction.task = req.body.task
      if(req.body.level) instruction.level = req.body.level

      game.instructions.push(instruction)
      game.save(function(err, updatedGame){
        if(err) res.json(err)
        console.log('Added Instruction')
        res.json(updatedGame)
      })
    }
  })
}

function deleteInstruction (req, res) {
  var gameId = req.params.gameId
  var instrId = req.params.instrId

  Game.findByIdAndUpdate(gameId, {
    $pull: {instructions: {_id: instrId}}
  }, function () {
    res.json({instrId: instrId})
  })
}

function startGame (req, res, next) {
  console.log ("Game is starting")
  var id = req.params.id
  Game.findById(id, function(err, game){
    if(err || !game){
      next(err)
    } else {
      var start_time = new Date();
      start_time.setSeconds(start_time.getSeconds() + 30);

      var exp_time = new Date(start_time)
      exp_time.setHours(exp_time.getHours()+1)

      game.start_time = start_time
      game.exp_time = exp_time

      game.instructions[0].start_time = start_time
      game.instructions[0].exp_time = exp_time

      console.log(game.instructions[0])

      game.save(function(err, updatedGame){
        if(err) next(err)
        console.log('updated Game start time')

        res.json({msg: "startGame function worked", start_time: updatedGame.start_time.getTime(), exp_time: updatedGame.exp_time.getTime()})
      })
    }
  })
}

function destroy(req, res, next){
    var id = req.params
    console.log(req.params)
  console.log("Deleting game", id)
  Game.remove({_id: id}, function(err, game){
    if(err) res.json(err)
    res.json({msg: "Game deleted", _id: id})
  })
}






