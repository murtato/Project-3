console.log("playerScript.js loaded")







// LODASH TEMPLATES
//
var _renderInstruction = _.template(`
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
var renderCurrentTask = _.template(`
  <h5>Current Task</h5>
  <div class="row">
      <div class="col s12 m7">
        <div class="card">
          <div class="card-image">
          </div>
          <div class="card-content">
            <span class="card-title">Task</span>
            <p class="current-task"><%= task %></p>
          </div>
          <div class="card-action">
            <form action="player_submit" method="post">
              <button type="submit">upload</button>
             </form>
          </div>
        </div>
      </div>
    </div>
  `)
var renderUpcomingTask = _.template(`
  <div class="row">
      <div class="col s12 m7">
        <div class="card">
          <div class="card-content">
            <span class="card-title">Task</span>
            <p><%= task %></p>
          </div>
        </div>
      </div>
    </div>
  `)

function renderInstructions(tasks) {
  tasks.forEach(instruction => {
    var taskHtml = _renderIstruction({instruction: instruction, game: game})
    $("#task-list").append(taskHtml)
  })
}
$(document).ready(function() {
  $.get(window.location.pathname + "/json")
  .then(data => {
    console.log('ajax called')
    var instructions = data.game.instructions
    var currentTask = data.user.currentTask
    instructions.forEach(function(task, index) {
      console.log(index)
      console.log(currentTask)
      if(currentTask == index) {
        $("#current").append(renderCurrentTask(task))
      }else if(currentTask < index ){
        $("#upcoming-container").append(renderUpcomingTask(task))
      }
    })
  })
})

