var User = require('../models/user');

module.exports = {
  index:     index,
  create:    create,
  leaveGame: leaveGame
}

function index(req, res) {
  console.log('user index function worked')
  User.find({}, function (err, users) {
    if(err) res.json(err);
    res.json(users)
  });
}

function create (req, res, next) {
  var newUser = new User(req.body)
  newUser.save(function (err, savedUser) {
    if (err) next (err);
    res.json(savedUser);
  })
}

function leaveGame(req, res) {
  User.findById(req.user.id, function (err, user) {
    user.currentGame = null
    user.currentTask = 0

    user.save(function (err, savedUser) {
      if (err) next (err)
      res.redirect("/")
    })

  })
}
