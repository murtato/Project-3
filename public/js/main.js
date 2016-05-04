var start_time
var exp_time

console.log("Hello World")
$(".button-collapse").sideNav();
// Initialize collapsible (uncomment the line below if you use the dropdown variation)
// Show sideNav
$('.button-collapse').sideNav('show');
// Hide sideNav
$('.button-collapse').sideNav('hide');


$(document).ready(function (){

})

function startGame(id) {
  $.ajax({
    type: "PUT",
    url: "/api/games/"+id+"/startgame"
  }).then(function(data){
    console.log("game has started")
    start_time = new Date(data.start_time)
    exp_time = new Date(data.exp_time)

    console.log("start_time =", start_time)
    console.log("exp_time =", exp_time)
  })
}
