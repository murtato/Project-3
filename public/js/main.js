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
  var html = $(e).parent().parent();
  //use AJAX to delete the entire task from our db
  // $.ajax({
  //   type: "DELETE",
  //   url: "/api/games/"+ e.target.id,
  // }).then(function(res){
  // html.remove();
  $.ajax ({
    type: 'DELETE',
    url: "/api/games/" + html.data('id')
  }).success(function(data){
    html.remove()
  });

  // console.log(html.data('id'));
  // })
}

// //delete a task
// $(".delete-button").on("click", function(e) {
//   e.preventDefault
//   var t = $("#")
// })


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
$('.button-collapse').sideNav('show');
$('.button-collapse').sideNav('hide');

