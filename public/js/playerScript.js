console.log("playerScript.js loaded")
var game
var user
var players
var gameId
var startTime
var expTime

$(document).ready(function (){
  gameId = $("#game-id").html()

  $.ajax({
    method: "GET",
    url: "/api/games/"+ gameId + "/json/"
  }).then(function (res) {
    game = res.game
    user = res.user
    players = res.players
  })
})

function addPhoto(gameId) {
  var photoUrl = $("#photo-url").val()
  console.log(photoUrl)
  $.ajax({
    method: "PUT",
    url: "/api/games/" + gameId + "/photo",
    data: {
      photoUrl: photoUrl,
      currentTask: user.currentTask
    }
  }).then(function (res){
    console.log(res)
  })
}
