var mongoose = require("mongoose");
var shortid = require('shortid');

shortid.characters('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@');

var instructionSchema = mongoose.Schema({
  task: String,
  level: Number,
  start_time: Date,
  exp_time: Date,
  player_ids: [{type: String }]
})

var photoSchema = mongoose.Schema({
  url: String,
  instruction_index: String,
  player_id: String,
  time_submitted: Date,
  time_reviewed: {type: Date, default: null},
  result: {type: Boolean, default: null}
})
var pointSchema = mongoose.Schema({
  player_id: String,
  points: Number
})
var gameSchema = mongoose.Schema({
  _id: { type: String, default: shortid.generate},
  host_id: {type: String, required: true},
  player_ids: [{type: String}],
  instructions: [instructionSchema],
  photos: [photoSchema],
  points: [pointSchema],
  start_time: Date,
  exp_time: Date
})
var Game = mongoose.model("Game", gameSchema)

module.exports = Game
