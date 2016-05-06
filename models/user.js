var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  fullName: String,
  firstName: String,
  imageUrl: String,
  email: String,
  googleId: String,
  currentTask: {type: Number, default: 0},
  currentGame: String
})

var User = mongoose.model('User', userSchema)

module.exports = User;
