console.log("hostScript.js loaded")
var game
var user
var players
var gameId
var startTime
var expTime

//
// LODASH TEMPLATES
//
var _renderInstruction = _.template(`
  <div class='col s12'>
    <div class='card'>
      <div class='card-content'>
        <span class='card-title'><%= instruction.task %></span>
        <% if (!game.start_time) { %>
          <button id="<%= instruction._id %>" onclick='deleteInstructionHandler(this)' class='delete btn red right'><i class='material-icons'>delete</i></button>
        <% } %>
      </div>
    </div>
  </div>
  `)

function renderInstructions(instructions) {
  instructions.forEach(instruction => {

  })
}

function renderInstruction(instruction) {
  var instructionHtml = _renderInstruction({instruction: instruction, game: game})
  $("#task-list").append(instructionHtml)
}


var _renderPhoto = _.template(`
    <div id='1231231243124134' class='card'>
      <div class='card-image waves-effect waves-block waves-light'>
        <img class='activator' src='<%= photo.url %>'>
      </div>
      <div class='card-content'>
        <button onclick='acceptPhotoHandler(this)' class='btn-large'><i class='material-icons'>thumb_up</i></button>
        <button onclick='rejectPhotoHandler(this)' class='btn-large'><i class='material-icons'>thumb_down</i></button>
      </div>
    </div>
  `)

function renderPhotos(photos){
  photos.forEach(photo => {
    if (photo.result == null) {
      renderPhoto(photo)
    }
  })
}

function renderPhoto(photo){
  photoHtml = _renderPhoto({photo: photo})
  $("#photos-container").append(photoHtml)
}

//
// /LODASH TEMPLATES
//





$(document).ready(function (){
  gameId = $("#game-id").html()

  $.ajax({
    method: "GET",
    url: "/api/games/"+ gameId + "/json/"
  }).then(function (res) {
    game = res.game
    user = res.user
    players = res.players

    renderInstructions(game.instructions)
    renderPhotos(game.photos)
  })
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


  if (t) {
    $.ajax({
      method: "PUT",
      url: "/api/games/"+ e.target.id+ "/instruction",
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
                "<button id=" + ins._id + " onclick='deleteInstructionHandler(this)' class='delete btn red right'><i class='material-icons'>delete</i></button>" +
              "</div>" +
            "</div>" +
          "</div>"
        )
      })
      $("#add-input").val("")
    })
  }
})

function deleteInstructionHandler(e) {
  var instrId = e.id

  console.log("clicked delete button")

  $.ajax({
    method: "PUT",
    url:'/api/games/'+ gameId + "/instruction/" + instrId
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

    var conSpace = $("<div>").addClass("con-space")
                             .append($("<div>").attr('id', 'clockmin'))
                             .append(" : ")
                             .append($("<div>").attr('id', 'clocksec'))
    $('#clock').append(conSpace)

    $("#startGame").hide();
    $(".footer123").hide();

  })
}

function acceptPhotoHandler(e) {

}


