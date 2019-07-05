/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

document.getElementById('embedFeedBtn').addEventListener('click', function(){
  var context = t.getContext();
  $.get("https://us-central1-fiverr-oikasocial.cloudfunctions.net/member?id="+context.member+"&boardID="+context.board, function(resp){
    console.log("ccc");
    console.log(resp);
  })
})
