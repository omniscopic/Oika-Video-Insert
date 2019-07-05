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
    return attachment.socialUrl;
  })
  .then(function(socialUrl){
    var context = t.getContext();
    /*$.get("https://us-central1-fiverr-oikasocial.cloudfunctions.net/member?id="+context.member+"&boardID="+context.board, function(resp){
      console.log(resp);
    })*/
    url = encodeURIComponent(socialUrl)

    iframe = '<iframe src="https://www.facebook.com/plugins/page.php?href='+url+'&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=true&appId=2152623648118362" width="340" height="500" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>'
    document.getElementById('socialFeed').innerHTML = iframe;
  })
  .then(function(){
    return t.sizeTo('#content');
  });
});
