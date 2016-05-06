var Game = require("../models/game")
var User = require("../models/user")
var locus = require("locus")

module.exports = {
  create:             create,
  join:               join,
  index:              index,
  renderGame:         renderGame,
  renderGameOver:     renderGameOver,
  show:               show,
  startGame:          startGame,
  addInstruction:     addInstruction,
  addPhoto:           addPhoto,
  updatePhoto:        updatePhoto,
  deleteInstruction:  deleteInstruction,
  destroy:            destroy,
  status:             status
}


function status(req, res, next){
  console.log("status of this GAME");
  var id = req.params.id
  Game.findById(id, function(err, game){
    if(err) res.json(err);
    res.json(game)
  })

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
              user.save(function (err, updatedUser) {
                if (err) res.json(err)
                res.redirect('/api/games/'+updatedGame._id)
              })
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

function renderGame(req, res, next) {
  if(!req.user){
    console.log("you have to be logged in")
    res.redirect('/auth/google')
  } else {
    var id = req.params.id

    Game.findById(id, function(err, game){

      if(err) res.json(err);

      User.find({_id: {$in: game.player_ids}}, function(err, players) {
        if (game.host_id == req.user.id){
          res.render('game/host', {game: game, user: req.user, players: players})
        } else {
          res.render('game/player', {game: game, user: req.user, players: players})
        }
      })
    });
  }
}

function renderGameOver(req, res, next) {
  var id = req.params.id

  Game.findById(id, function(err, game){
    if(err) res.json(err)

    User.find({_id: {$in: game.player_ids}}, function(err, players) {
      res.render('game/gameOver', {game: game, user: req.user, players: players})
    })

  })
}

function show(req, res, next) {
  console.log("show controller worked")
  var id = req.params.id

  Game.findById(id, function(err, game){
    if(err) {
      res.json(err)
    } else {
      User.find({_id: {$in: game.player_ids}}, function(err, players) {
        res.json({game: game, user: req.user, players: players})
      })
    }
  })
}


function addInstruction(req, res, next){
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

function addPhoto(req, res, next){
  console.log("Adding Photo controller")
  var id = req.params.id
  var photoUrl = req.body.photoUrl
  var currentTask = req.body.currentTask
  console.log(currentTask)
  var photo = {
    url: photoUrl,
    player_id: req.user._id,
    instruction_index: currentTask,
    time_submitted: new Date()
  }

  Game.findById(id, function(err, game){
    if(err) res.json(err)
    game.photos.push(photo)
    game.save(function(err, updatedGame){
      if(err) res.json(err)
      console.log("added photo to game")
      res.json(updatedGame.photos[updatedGame.photos.length-1])
    })
  })
}

function updatePhoto(req, res, next) {
  console.log("update photo controller ran")

  var gameId = req.params.gameId
  var photoId = req.params.photoId
  var result = req.body.result

  Game.findById(gameId, function (err, game){
    if (err) res.json(err)

    var photo = game.photos.id(photoId)
    photo.result = result

    if (result == 'true') {
      console.log("adding 1")
      var playerId = photo.player_id
      User.findById(playerId, function (err, user) {
        if (err) res.json(err)
        user.currentTask++
        user.save(function (err, updatedUser) {
          if (err) res.json(err)
        })
      })
    }

    game.save(function (err, updatedGame) {
      if (err) res.json(err)
      res.json(updatedGame)
    })
  })


}


function deleteInstruction (req, res) {
  console.log("delete instruction controller function ran")
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
      res.json(err)
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
        if(err) res.json(err)
        console.log('updated Game start time')

        User.update(
          {_id: {$in: updatedGame.player_ids}},
          {$set: {currentTask: 0}}, function (err) {
            res.json({msg: "startGame function worked", start_time: updatedGame.start_time.getTime(), exp_time: updatedGame.exp_time.getTime()})
        })
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






