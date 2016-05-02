var User = require('../models/user');

module.exports = {
  create: create
};

function create(req, res, next) {
  var fact = req.body.fact;
  var student = req.user;
  student.facts.push({text:fact})
  student.save(function(err) {
    res.json(student);
  console.log("User created")
  })
}

function del(req, res) {

}
