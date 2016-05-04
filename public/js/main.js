console.log("main.js loaded")
var gameId
var startTime
var expTime

$(document).ready(function (){
  gameId = $("#game-id").html()

})

function startGame(id) {
  $.ajax({
    type: "PUT",
    url: "/api/games/"+id+"/startgame"
  }).then(function(data){
    console.log("game has started.")
    startTime = new Date(data.start_time)
    expTime = new Date(data.exp_time)
  })
}



$(".button-collapse").sideNav();
// Initialize collapsible (uncomment the line below if you use the dropdown variation)
// Show sideNav
$('.button-collapse').sideNav('show');
// Hide sideNav
$('.button-collapse').sideNav('hide');
