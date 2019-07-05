/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

document.getElementById('embedFeedBtn').addEventListener('click', function(){
  return t.set('card', 'shared', 'socialUrl', "SOCIAL FEED").then(function(){
    t.attach({url: "SOCIAL FEED"});
    t.closePopup();
  })
  t.closePopup();
});
