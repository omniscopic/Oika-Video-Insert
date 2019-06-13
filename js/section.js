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
      if (url.startsWith("https://www.youtube.com") || url.startsWith("https://m.youtube.com") || url.startsWith("http://www.youtube.com") || url.startsWith("http://m.youtube.com")){
        if (url.includes("watch")){
          console.log("URL is a Video");
          yt_code = url.split("=")[1];
        }       
        
      }else if (url.startsWith("https://youtu.be") || url.startsWith("http://youtu.be")){
        yt_code = url.split("/")[3];
      }
      // ytURL = JSON.stringify(url, null, 2);
      var iframe = '<iframe width="853" height="480" src="https://www.youtube.com/embed/'+yt_code+'" frameborder="0" allowfullscreen></iframe>';
      document.getElementById('video').innerHTML = iframe;    
    })
  })
  .then(function(){
    return t.sizeTo('#content');
  });
});
