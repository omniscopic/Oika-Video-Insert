/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

// you can access arguments passed to your iframe like so
var arg = t.arg('arg');

t.render(function(){
  // make sure your rendering logic lives here, since we will
  // recall this method as the user adds and removes attachments
  // from your section
  t.card('attachments')
  .get('attachments')
  .filter(function(attachment){
    console.log(attachment);
    return attachment.url.indexOf('https://www.youtube.com') == 0;
  })
  .then(function(ytURL){
    yt_code = ytURL.url.split("=")[1];

    var iframe = '<iframe src="https://www.youtube.com/embed/"'+yt_code+' frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
    document.getElementById('video').innerHTML = iframe;    
  })
  .then(function(){
    return t.sizeTo('#content');
  });
});
