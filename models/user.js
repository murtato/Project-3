var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  // email: {type: String, required: true},
  facebookId: {type: String, required: true},
  gamesPlaying: {[game_id]},
  gamesHosting: {[game_id]}
})

var User = mongoose.model('User', userSchema)

module.exports = User;
