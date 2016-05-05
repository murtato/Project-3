console.log("main.js loaded")
var gameId
var startTime
var expTime

//
// LODASH TEMPLATES
//

var game = {"_id":"BTLGDq89","host_id":"5729365470a42a48e570bee5","__v":5,"points":[],"photos":[],"instructions":[{"task":"asdfasdf","_id":"572b79744ccb1b6b528c415f","player_ids":[]},{"task":"asdfa","_id":"572b79764ccb1b6b528c4160","player_ids":[]}],"player_ids":[]}

var blah ={ instruction: {"task":"saijk","_id":"572ac67eb7dd8a7607332725","exp_time":"2016-05-05T05:05:51.021Z","start_time":"2016-05-05T04:05:51.021Z","player_ids":[]}, game: game}

var renderInstruction = _.template(`
  <div class='col s12'>
    <div class='card'>
      <div class='card-content'>
        <span class='card-title'><%= instruction.task %></span>
        <% if (!game.start_time) { %>
          <button id="<%= instruction._id %>" onclick='deleteHandler(this)' class='delete btn red right'><i class='material-icons'>delete</i></button>
        <% } %>
      </div>
    </div>
  </div>
  `)




//
// /LODASH TEMPLATES
//

$(document).ready(function (){
  gameId = $("#game-id").html()

  $.ajax({
    method: "GET",
    url: "/api/games/"+ gameId + "/json/"
  }).then(function (res) {
    var game = res.game
    // var players = res.players
    console.log(game)
    console.log(res)
  })
    // var instrHTML = renderInstruction({instruction: instruction, game: game})
    // $('#task-list').append(instrHTML)

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

