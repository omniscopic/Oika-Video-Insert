var t = TrelloPowerUp.iframe();


t.render(function(){
  // make sure your rendering logic lives here, since we will
  // recall this method as the user adds and removes attachments
  // from your section
  var url = t.arg('ytUrl');
    
    if (url.startsWith("https://www.youtube.com") || url.startsWith("https://m.youtube.com") || url.startsWith("http://www.youtube.com") || url.startsWith("http://m.youtube.com")){
        if (url.includes("watch") && url.includes("list")){
          yt_code = url.split("=")[2];
          var iframe = '<iframe width="720" height="405" src="https://www.youtube.com/embed/?listType=playlist&list='+yt_code+'" frameborder="0" allowfullscreen>'
        }
        else if (url.includes("watch")){
          yt_code = url.split("=")[1];
          var iframe = '<iframe width="853" height="480" src="https://www.youtube.com/embed/'+yt_code+'" frameborder="0" allowfullscreen></iframe>';
        }else if (url.includes("playlist") || url.includes("list")){
          yt_code = url.split("=")[1];
          var iframe = '<iframe width="720" height="405" src="https://www.youtube.com/embed/?listType=playlist&list='+yt_code+'" frameborder="0" allowfullscreen>'
        }
        
      }else if (url.startsWith("https://youtu.be") || url.startsWith("http://youtu.be")){
        yt_code = url.split("/")[3];
        var iframe = '<iframe width="853" height="480" src="https://www.youtube.com/embed/'+yt_code+'" frameborder="0" allowfullscreen></iframe>';
      }
      // ytURL = JSON.stringify(url, null, 2);
      document.getElementById('video').innerHTML = iframe; 
      return t.sizeTo('#content');
});
