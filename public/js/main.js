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


  if (t) {
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
          "<div class='col s12'>" +
            "<div class='card'>" +
              "<div class='card-content'>" +
                "<span class='card-title'>" + ins.task + "</span>" +
                "<button id=" + ins._id + " onclick='deleteHandler(this)' class='delete btn red right'><i class='material-icons'>delete</i></button>" +
              "</div>" +
            "</div>" +
          "</div>"
        )
      })
      $("#add-input").val("")
    })
  }
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


    //remove all delete buttons from tasks
    $(".delete").remove()
  })
}

$(".button-collapse").sideNav();
$('.button-collapse').sideNav('show');
$('.button-collapse').sideNav('hide');

