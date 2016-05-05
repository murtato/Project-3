console.log("main.js loaded")
var gameId
var startTime
var expTime

$(document).ready(function (){
  gameId = $("#game-id").html()
})

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
  })
}

$(".button-collapse").sideNav();
$('.button-collapse').sideNav('show');
$('.button-collapse').sideNav('hide');

