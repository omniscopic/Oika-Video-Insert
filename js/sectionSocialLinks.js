var t = TrelloPowerUp.iframe();

// you can access arguments passed to your iframe like so
var arg = t.arg('arg');

t.render(function(){
  // make sure your rendering logic lives here, since we will
  // recall this method as the user adds and removes attachments
  // from your section

  
  //iframe = '<a class="twitter-timeline" href='+t.arg('fbUrl')+'></a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
  //document.getElementById('socialFeed').innerHTML = iframe;
  return t.sizeTo(500);
});
