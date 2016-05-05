
console.log("main.js loaded")
var gameId
var startTime
var expTime

$(document).ready(function (){
  gameId = $("#game-id").html()
  status()

})

function status(){
  $.get('/api/games/status/' + gameId)
  .done(function(data) {
    console.log(data)
    console.log("success");

    startTime = new Date(data.start_time)
    expTime = new Date(data.exp_time)
    setInterval(function(){
      var msLeft = expTime - new Date()
      minLeft = parseInt(msLeft / 1000 / 60);
      document.getElementById('clockmin').innerHTML = minLeft
      $( "#clockmin" ).append( document.createTextNode( " min" ) );
      secsLeft = parseInt(msLeft/1000 - minLeft*60);
      document.getElementById('clocksec').innerHTML = secsLeft
      $( "#clocksec" ).append( document.createTextNode( " sec" ) );

    }, 1000);
    if(startTime == expTime){
        endGame()
    }
  })
}

function endGame(){
  $.get('/api/games/status/' + gameId)
  .done(function(data) {
    console.log("GAME OVER")
 })
}

$(".add-button").on("click", function (e) {
  e.preventDefault
  var t = $("#add-input").val()
  var list = $("#task-list")

  $.ajax({
    method: "PUT",
    url: "/api/games/"+ e.target.id,
    data: {
      task: t
    }
  }).then(function(res){
    list.empty();
    res.instructions.forEach(function(ins, index) {
      list.append(
        "<li><div class='collapsible-header'><i class='material-icons'></i>"+
        "Task " + index +
        "</div><div class='collapsible-body'><p>" + ins.task + "</p>"+
        "<button id="+ins._id+" onclick='deleteHandler(this)' class='delete'>delete</button></div></li>"
      )
    })
  })
})

function deleteHandler(e) {
  var instrId = e.id

  console.log("clicked delete button")

  $.ajax({
    method: "PUT",
    url:'/api/games/'+ gameId + "/" + instrId
  }).then(function (data) {
    $('#'+data.instrId).parent().parent().remove()
  })
}

function startGame(id) {
  $.ajax({
    type: "PUT",
    url: "/api/games/"+id+"/startgame"
  }).then(function(data){
    console.log("game has started.")
    startTime = new Date(data.start_time)
    expTime = new Date(data.exp_time)
    var conSpace = $("<div>").addClass("con-space")
                             .append($("<div>").attr('id', 'clockmin'))
                             .append(" : ")
                             .append($("<div>").attr('id', 'clocksec'))
    $('#clock').append(conSpace)

    $("#startGame").hide();
    $(".footer123").hide();
  })
}



$(".button-collapse").sideNav();
$('.button-collapse').sideNav('show');
$('.button-collapse').sideNav('hide');

