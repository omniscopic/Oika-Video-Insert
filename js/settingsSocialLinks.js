/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

document.getElementById('embedFeedBtn').addEventListener('click', function(){
  t.attach({socialUrl: "FB FEED"});
  t.closePopup();
});
