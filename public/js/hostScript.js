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
    renderInstruction(instruction)
  })
}

function renderInstruction(instruction) {
  var instructionHtml = _renderInstruction({instruction: instruction, game: game})
  $("#task-list").append(instructionHtml)
}


var _renderPhoto = _.template(`
    <div class='card'>
      <div class='card-image waves-effect waves-block waves-light'>
        <img class='activator' src='<%= photo.url %>'>
      </div>
      <div class='card-content'>
        <div>
          <span class="card-title"><%= game.instructions[photo.instruction_index].task %></span>
        </div>

        <div>
          <button onclick='acceptPhotoHandler(this)' id='<%= photo._id %>' class='btn-large'><i class='material-icons'>thumb_up</i></button>
          <button onclick='rejectPhotoHandler(this)' id='<%= photo._id %>' class='btn-large'><i class='material-icons'>thumb_down</i></button>
        </div>
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
  // check if url is a real url
  var first4Letters = photo.url.substring(0,4)

  if (first4Letters != "http" && first4Letters != "data"){
    photo.url = "https://i.imgflip.com/13ojqf.jpg"
  }

  photoHtml = _renderPhoto({photo: photo})
  $("#photos-container").append(photoHtml)
}


var _renderPlayer = _.template(`
    <div class='chip'>
      <img src='<%= player.imageUrl %>'>
      <%= player.firstName %>
    </div>
  `)

function renderPlayer(player) {
  var playerHtml = _renderPlayer({player: player})
  $("#players-container").append(playerHtml)
}

//
// END LODASH TEMPLATES
//




$(document).ready(function (){
  // Web Socket Connection
  // Get our connection to the socket.io server
  var socket = io();
  console.log(socket);

  // ----- End Web Socket Connection


  //initialize gameId and begin rendering game
  gameId = $("#game-id").html()


  $.get(window.location.pathname + "/json")
  .then(function (res) {
    game = res.game
    user = res.user
    players = res.players

    // ---- Setup web socket events
    socket.on(game._id, function(res){
      console.log("message recieved")

      Materialize.toast(res.msg, 4000)

      if(res.event == "joined"){
        renderPlayer(res.data)
      }

      if(res.event == "start"){
        location.reload()
      }

      if(res.event == "gameOver"){
        var newUrl = window.location.pathname + "/gameOver"
        window.location.replace(newUrl)
      }


      if(res.event == "photoAdded"){
        console.log("photo added")
        renderPhoto(res.data)
      }

    })
    // ----- End Web Sockets

    if (game.exp_time){
      addTimer()
    }

    if (game.instructions.length > 0) {
      $("#startGame").removeClass('disabled')
    }

    renderInstructions(game.instructions)

    players.forEach(player => {
      renderPlayer(player)
    })

    if(game.start_time){
      renderPhotos(game.photos)
    }


  })
})

function addTimer(){
  $.get('/api/games/status/' + gameId)
  .done(function(data) {

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
      game.instructions.push(res.instructions[res.instructions.length-1])
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

      $("#startGame").removeClass('disabled')

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
  console.log("please add an instruction")
  if (game.instructions.length > 0) {
    console.log("starting game")
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

      //remove all delete buttons from tasks
      $(".delete").remove()
      $("#startGame").hide();
      $(".footer123").hide();
      $("#add-instruction-form").remove()
    })

  }
}

function acceptPhotoHandler(e) {
  console.log("accepting photo")
  var photoId = e.id

  updatePhotoInDb(photoId, true)
}

function rejectPhotoHandler(e) {
  console.log("rejecting photo")
  var photoId = e.id

  updatePhotoInDb(photoId, false)
}

function updatePhotoInDb(photoId, result) {
  $.ajax({
    method: "PUT",
    url:'/api/games/'+ gameId + "/photo/" + photoId,
    data:{
      result: result
    }
  }).then(function (res) {
    console.log("Photo updated")
    console.log(res)
    game = res

    //remove photo from dom
    $("#"+photoId).parent().parent().parent().remove()
  })
}


