var Game = require("../models/game")
var User = require("../models/user")

module.exports = {
  create:           create,
  join:             join,
  index:            index,
  show:             show,
  startGame:        startGame,
  addInstruction:   addInstruction,
  destroy:          destroy
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
            res.redirect('/api/games/'+currentGame)
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
    var userId = req.user._id
    var id = req.body.gameId

    Game.findById(id, function(err, game){
      // 1. check if there's an error
      if(err || !game) {
        res.json(err);
      // 2. check if current user is already part of game
      } else if(game.player_ids.indexOf(userId) != -1) {
        res.render('game/player', {game:game, msg: "you're already part of this game"})
      // 3. check if current user is the host
      } else if(game.host_id == userId) {
        res.render('game/host', {game: game, msg: "you're the host of this game"})
      // 4. else add current user to game
      } else {
        game.player_ids.push(userId)
        game.save(function (err, updatedGame) {
          if(err) res.json(err);
          res.render('game/player', updatedGame)
        })
      }
    });
  }
}

function index(req, res, next){
  console.log('index contoller function WORKED')
  Game.find({}, function(err, games){
    if(err) res.json(err);
    res.json(games)
  });
}

function show (req, res, next) {
  if(!req.user){
    console.log("you have to be logged in")
    res.redirect('/auth/google')
  } else {
    console.log("show controller worked")
    var id = req.params.id
    Game.findById(id, function(err, game){
      if(err) res.json(err);
      if (game.host_id == req.user.id){
        res.render('game/host', {game: game})
      } else {
        res.render('game/player', {game: game})
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

function startGame (req, res, next) {
  console.log ("Game is starting")
  var id = req.params.id
  Game.findById(id, function(err, game){
    if(err || !game){
      next(err)
    } else {
      var start_time = new Date();
      start_time.setSeconds(start_time.getSeconds() + 30);
      game.start_time = start_time
      game.save(function(err, updatedGame){
        if(err) next(err)
        console.log('updated Game start time')
        res.json({msg: "startGame function worked", game: game})
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






