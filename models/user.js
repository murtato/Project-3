var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  fullName: String,
  firstName: String,
  imageUrl: String,
  email: String,
  googleId: String
  // firstName: String//{type: String, required: true},
  // lastName: String//{type: String, required: true},
  // email: {type: String, required: true},
  // googleId: {type: String, required: true}
  // // gamesPlaying: {[game_id]},
  // // gamesHosting: {[game_id]}
})

var User = mongoose.model('User', userSchema)

module.exports = User;
