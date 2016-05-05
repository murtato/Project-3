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

function renderInstructions(tasks) {
  tasks.forEach(instruction => {
    var taskHtml = _renderIstruction({instruction: instruction, game: game})
    $("#task-list").append(taskHtml)
  })
}

$.get(window.location.pathname + "/json")
.then(data => {
  instructions = data.game.instructions
  currentTask = data.user.current_task

  currentTask = instructions[currentTask]




  $('.current-task').append(`${data.game.instructions[0].task}`)
})
