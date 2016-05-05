console.log("playerScript.js loaded")

function addPhoto(gameId) {
  var photoUrl = $("#photo-url").val()
  console.log(photoUrl)
  $.ajax({
    method: "PUT",
    url: "/api/games/" + gameId + "/photo",
    data: {
      photoUrl: photoUrl
    }
  }).then(function (res){
    console.log(res)
  })
}

