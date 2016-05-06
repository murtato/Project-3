console.log("playerScript.js loaded")
var game
var user
var players
var gameId
var startTime
var expTime

// LODASH TEMPLATES
//

var renderCurrentTask = _.template(`
  <h5>Current Task</h5>
  <div class="row">
      <div class="col s12">
        <div class="card">
          <div class="card-image">
          </div>
          <div class="card-content">
            <span class="card-title">Task</span>
            <p class="current-task"><%= task %></p>
            <img id="photo"></img>
          </div>
            <div class="row">
              <div class="col s12">
                <input id="photo-url" type="text" placeholder="Add a photo url">
                <button id="submit-photo" class="btn"  onclick="addPhoto('<%= game._id %>')">Submit</button>
              </div>
            </div>
        </div>
      </div>
    </div>
  `)
var renderUpcomingTask = _.template(`
    <div class="row">
        <div class="col s12">
          <div class="card">
            <div class="card-content">
              <span class="card-title">Task</span>
              <p><%= task %></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `)
var renderAcceptedPhoto = _.template(`
  <div class="row">
    <div class="col s12 m7">
      <div class="card">
        <div class="card-image">
          <img src="<%= photo.url %>">
          <span class="card-title">Task</span>
        </div>
        <div class="card-content">
          <span class="card-title"><%= game.instructions[photo.instruction_index].task %></span>
        </div>
      </div>
    </div>
  </div>
  `)


$(document).ready(function() {
  $.get(window.location.pathname + "/json")
  .then(data => {
    // update global variables
    game = data.game
    user = data.user
    players = data.players

    // begin rendering page
    console.log('ajax called')
    var instructions = data.game.instructions
    var currentTask = data.user.currentTask

    instructions.forEach(function(task, index) {
      console.log(index)
      console.log(currentTask)
      if(currentTask == index) {
        $("#current-container").append(renderCurrentTask(task))
      }else if(currentTask < index ){
        $("#upcoming-container").append(renderUpcomingTask(task))
      }
    })

    // loop through game.photos and set photoFound = true if photo.result  = true
     data.game.photos.forEach(function(photo){
    if(photo.result){
       if(photo.player_id == user._id){
        console.log("YES")

     $("#acccepted-picture").append(renderAcceptedPhoto({photo:photo}))
   }
     }
   })
  })
})

function addPhoto(gameId) {
  console.log(gameId)
  var photoUrl = $("#photo-url").val()
  console.log(photoUrl)

  console.log("stop here")
  $.ajax({
    method: "PUT",
    url: "/api/games/" + gameId + "/photo",
    data: {
      photoUrl: photoUrl,
      currentTask: user.currentTask
    }
  }).then(function (res){
    console.log("addPhoto is working")
    console.log(res)
    $("#photo-url").val("")

    console.log('Response recieved')
    $("#photo").attr("src", photoUrl)
    $("#photo").attr("height", 300)
    $("#photo").attr("width", 300)

  })
}
