console.log("Hello World")

$(".button-collapse").sideNav();
// Initialize collapsible (uncomment the line below if you use the dropdown variation)
$('.button-collapse').sideNav('show');
$('.button-collapse').sideNav('hide');

// var $gameTask;

// var renderTask = _.template(`
//   <li id="task-<$= _id $>" class="task-instructions">
//     <%= task %>
//   `)

// function getId(jqueryThing) {
//   return jqueryThing.attr('id')
// }

// var taskHandler = function (task) {
//   $("#tasks").append("<li class='task>" + task.instruction)
// }


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
        "</div><div class='collapsible-body'><p>" + ins.task + "</p></div></li>"
        )
    })
  })
})
