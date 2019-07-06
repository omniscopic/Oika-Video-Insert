/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

document.getElementById('embedFeedBtn').addEventListener('click', function(){
	var fbURL = document.getElementById('fbURL').value;
	t.attach({url: fbURL});
    t.closePopup();
});
