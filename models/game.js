var mongoose = require("mongoose")

var instructionSchema = mongoose.Schema({
  task: String,
  level: Number,
  start_time: Date,
  expiration: Date,
  player_ids: [{type: String }]
})

var photoSchema = mongoose.Schema({
  url: String,
  instruction_id: String,
  palyer_id: String,
  time_submitted: Date,
  time_reviewed: {type: Date, default: null},
  result: {type: Boolean, default: null}
})
var pointSchema = mongoose.Schema({
  player_id: String,
  points: Number
})
var gameSchema = mongoose.Schema({
  host_id: {type: String, required: true},
  player_ids: [{type: String, require: true}],
  instructions: [instructionSchema],
  photos: [photoSchema],
  points: [pointSchema],
  start_time: Date,
  expiration: Date
})
var Game = mongoose.model("Game", gameSchema)

module.exports = Game
