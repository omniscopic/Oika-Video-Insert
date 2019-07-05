/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

document.getElementById('embedFeedBtn').addEventListener('click', function(){
  return t.set('card', 'shared', 'socialUrl', "https://www.facebook.com/helarapwadan/").then(function(){
    t.attach({socialUrl: "https://www.facebook.com/helarapwadan/"});
    t.closePopup();
  })
  t.closePopup();
});
