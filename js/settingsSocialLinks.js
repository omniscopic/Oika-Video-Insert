/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

document.getElementById('embedFeedBtn').addEventListener('click', function(){
  console.log("Clicked");
  var context = t.getContext();
  console.log(JSON.stringify(context, null, 2));
})
