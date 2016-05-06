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
        <div class="card taco">
          <div class="card-image">
          </div>
          <div class="card-content">
            <span class="card-title">Task</span>
            <p class="current-task"><%= task %></p>
          </div>
            <div class="row">
              <div class="col s12">
                <input id="photo-url" type="text" placeholder="Add a photo url">
                <button id="submit-photo" class="btn"  onclick="addPhoto('<$= game.id $>')">Submit</button>
              </div>
            </div>
        </div>
      </div>
    </div>
  `)
var renderUpcomingTask = _.template(`
  <h5>Upcoming Tasks</h5>
    <div class="row">
        <div class="col s12">
          <div class="card taco">
            <div class="card-content">
              <span class="card-title">Task</span>
              <p><%= task %></p>
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
  })
})

function addPhoto(gameId) {
  var photoUrl = $("#photo-url").val()
  console.log(photoUrl)
  $.ajax({
    method: "PUT",
    url: "/api/games/" + gameId + "/photo",
    data: {
      photoUrl: photoUrl,
      currentTask: user.currentTask
    }
  }).then(function (res){
    console.log(res)
  })
}
