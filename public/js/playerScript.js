console.log("playerScript.js loaded")
var game
var user
var players
var gameId
var startTime
var expTime
var currentTask

// LODASH TEMPLATES
//

var renderCurrentTask = _.template(`
  <div class="row incomplete-tasks">
      <div class="col s12 m8 push-m2">
        <div class="card">
          <div class="card-image">
          </div>
          <div class="card-content">
            <p class="current-task card-title"><%= task %></p>
            <img id="photo"></img>
          </div>
            <div class="row incomplete-tasks">
              <div class="col s12">
                <input id="photo-url" type="text" placeholder="Add a photo url">
                <button id="submit-photo" class="btn" onclick="addPhoto('<%= game._id %>')">Submit</button>
                <div id="waiting-bar-goes-here"> </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  `)
var renderUpcomingTask = _.template(`
    <div class="row incomplete-tasks">
        <div class="col s12 m8 push-m2">
          <div class="card">
            <div class="card-content">
              <p><%= task %></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `)
var renderAcceptedPhoto = _.template(`
  <div class="row">
    <div class="col s12 m8 push-m2">
      <div class="card">
        <div class="card-image">
          <img src="<%= photo.url %>">
          <span class="card-title">Completed Task</span>
        </div>
        <div class="card-content">
          <span class="card-title"><%= game.instructions[photo.instruction_index].task %></span>
        </div>
      </div>
    </div>
  </div>
  `)

var renderUserPlayerWaiting = _.template(`
    <div class="row">
    <div class="col s12 m8 push-m2">
      <div class="card">
        <div class="card-image">
          <img src="<%= url %>">
          <span class="card-title"></span>
        </div>
        <div class="card-content">
          <span class="card-title">
            <div class="progress">
              <div class="indeterminate"></div>
            </div>
            waiting for host...
          </span>
        </div>
      </div>
    </div>
  </div>

  `)

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



$(document).ready(function() {
  // Web Sockets
  // Get our connection to the socket.io server
  var socket = io();
  console.log(socket);

  // ----- End Web Socket Connection



  $.get(window.location.pathname + "/json")
  .then(data => {
    // update global variables
    game = data.game
    user = data.user
    players = data.players
    gameId = data.game._id

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

      if(res.event == "photoAccepted"){
        console.log("photo was accepted")

        console.log(res.data.player_id)
        if (res.data.player_id){
          $("#acccepted-picture").append(renderAcceptedPhoto({photo:res.data}))
        }

        $(".incomplete-tasks").remove()

        var instructions = data.game.instructions
        currentTask++

        instructions.forEach(function(task, index) {
          if(currentTask == index) {
            $("#current-container").append(renderCurrentTask(task))
          }else if(currentTask < index ){
            $("#upcoming-container").append(renderUpcomingTask(task))
          }
        })

      }

      if(res.event == "photoRejected"){
        console.log("photo was rejected")

        $(".incomplete-tasks").remove()

        var instructions = data.game.instructions
        currentTask++

        instructions.forEach(function(task, index) {
          if(currentTask == index) {
            $("#current-container").append(renderCurrentTask(task))
          }else if(currentTask < index ){
            $("#upcoming-container").append(renderUpcomingTask(task))
          }
        })
      }

    })
    // ----- End Web Sockets


    // begin rendering page
    if (game.exp_time){
      addTimer()
    }
    var instructions = data.game.instructions
    var currentTask = data.user.currentTask

    instructions.forEach(function(task, index) {
      if(currentTask == index) {
        $("#current-container").append(renderCurrentTask(task))
      }else if(currentTask < index ){
        $("#upcoming-container").append(renderUpcomingTask(task))
      }
    })

    // loop through game.photos and set photoFound = true if photo.result  = true

    var waitingOnHost = false
     data.game.photos.forEach(function(photo){
      if(photo.result){
         if(photo.player_id == user._id){
            console.log("YES")
            $("#acccepted-picture").append(renderAcceptedPhoto({photo:photo}))
          }
       }
       else if (photo.result == null) {
         // render waiting photof
              $("#photo").attr('src', photo.url)
              $("#submit-photo").remove()
              $('#photo-url').remove()
              $(".loading-gose-here").addClass('indeterminate')
              $(".progress").show()
              $(".waiting-for-host").show()
              waitingOnHost = true

            //    <div class="progress">
            //   <div class="indeterminate"></div>
            // </div>
       }
     })
     if (!waitingOnHost) {
      $(".waiting-for-host").hide(0)
      $(".progress").hide(0)
    }
  })

})

function addPhoto(gameId) {
  console.log(gameId)
  var photoUrl = $("#photo-url").val()
  var first4Letters = photoUrl.substring(0,4)
  if (first4Letters != "http"){
    Materialize.toast('Not a valid image url!', 4000)
  } else {
    $.ajax({
      method: "PUT",
      url: "/api/games/" + gameId + "/photo",
      data: {
        photoUrl: photoUrl,
        currentTask: user.currentTask
      }
    }).then(function (res){

      console.log("addPhoto is working")
      console.log("what is this?", res)
      // $("#photo-url").val("")

      // console.log('Response recieved')
      // $("#photo").attr("src", photoUrl)
      // $("#photo").attr("height", 300)
      // $("#photo").attr("width", 300)

        console.log("STAY")


     // $("#current-container").append(renderUserPlayerWaiting({url:photoUrl}))
     $("#photo").attr('src', photoUrl)




     $("#submit-photo").remove()
     $('#photo-url').remove()
     $(".loading-gose-here").addClass('indeterminate')
     $(".progress").show()
     $(".waiting-for-host").show()
     $("#waiting-bar-goes-here").append($("<div class='progress'><div class='loading-gose-here'></div></div>"
))
     $("#waiting-bar-goes-here").append($("<span class='waiting-for-host'>waiting for host...</span>"))

    })
  }
}

 //        console.log("null is not a string")
 //         if(photo.player_id == user._id){
 //          console.log("this user has this photo")


function addTimer(){
  $.get('/api/games/status/' + gameId)
  .done(function(data) {
    // console.log(data)
    // startTime = new Date(data.start_time)
    expTime = new Date(data.exp_time)
    // console.log(startTime)
    // console.log(expTime)
    setInterval(function(){
      var msLeft = expTime - new Date()
      // console.log(msLeft)
      minLeft = parseInt(msLeft / 1000 / 60);
      // console.log(minLeft)
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


