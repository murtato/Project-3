var User = require('../models/user');

module.exports = {
  index:    index,
  create:   create,

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
