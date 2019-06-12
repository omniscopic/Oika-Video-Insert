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
    return attachment.url;
  })
  .then(function(ytURL){
    return t.get('card', 'private', 'ytURL').then(function(url){
      ytURL = JSON.stringify(url, null, 2);
      if (ytURL.startsWith("https://www.youtube.com") || ytURL.startsWith("https://m.youtube.com")){
        yt_code = ytURL.split("=")[1].split('"')[0];
      }else if (ytURL.startsWith("https://youtu.be/") || ytURL.startsWith("http://youtu.be/") ){
        yt_code = ytURL.split("/")[3].split('"')[0];
      }
      
      var iframe = '<iframe width="853" height="480" src="https://www.youtube.com/embed/'+yt_code+'" frameborder="0" allowfullscreen></iframe>';
      document.getElementById('video').innerHTML = iframe;    
    })
  })
  .then(function(){
    return t.sizeTo('#content');
  });
});
