/* global TrelloPowerUp */

// we can access Bluebird Promises as follows
var Promise = TrelloPowerUp.Promise;

/*

Trello Data Access

The following methods show all allowed fields, you only need to include those you want.
They all return promises that resolve to an object with the requested fields.

Get information about the current board
t.board('id', 'name', 'url', 'shortLink', 'members')

Get information about the current list (only available when a specific list is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.list('id', 'name', 'cards')

Get information about all open lists on the current board
t.lists('id', 'name', 'cards')

Get information about the current card (only available when a specific card is in context)
So for example available inside 'attachment-sections' or 'card-badges' but not 'show-settings' or 'board-buttons'
t.card('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about all open cards on the current board
t.cards('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')

Get information about the current active Trello member
t.member('id', 'fullName', 'username')

For access to the rest of Trello's data, you'll need to use the RESTful API. This will require you to ask the
user to authorize your Power-Up to access Trello on their behalf. We've included an example of how to
do this in the `🔑 Authorization Capabilities 🗝` section at the bottom.

*/

/*

Storing/Retrieving Your Own Data

Your Power-Up is afforded 4096 chars of space per scope/visibility
The following methods return Promises.

Storing data follows the format: t.set('scope', 'visibility', 'key', 'value')
With the scopes, you can only store data at the 'card' scope when a card is in scope
So for example in the context of 'card-badges' or 'attachment-sections', but not 'board-badges' or 'show-settings'
Also keep in mind storing at the 'organization' scope will only work if the active user is a member of the team

Information that is private to the current user, such as tokens should be stored using 'private' at the 'member' scope

t.set('organization', 'private', 'key', 'value');
t.set('board', 'private', 'key', 'value');
t.set('card', 'private', 'key', 'value');
t.set('member', 'private', 'key', 'value');

Information that should be available to all users of the Power-Up should be stored as 'shared'

t.set('organization', 'shared', 'key', 'value');
t.set('board', 'shared', 'key', 'value');
t.set('card', 'shared', 'key', 'value');
t.set('member', 'shared', 'key', 'value');

If you want to set multiple keys at once you can do that like so

t.set('board', 'shared', { key: value, extra: extraValue });

Reading back your data is as simple as

t.get('organization', 'shared', 'key');

Or want all in scope data at once?

t.getAll();

*/

var GLITCH_ICON = './images/glitch.svg';
var WHITE_ICON = './images/icon-white.svg';
var GRAY_ICON = './images/icon-gray.svg';
var YOUTUBE_GRAY = "./images/yt_icon_gray.png";
var YOUTUBE = "./images/YT_PlayButton.png";

var randomBadgeColor = function() {
  return ['green', 'yellow', 'red', 'none'][Math.floor(Math.random() * 4)];
};

var boardButtonCallback = function(t){
  return t.popup({
    title: 'Popup List Example',
    items: [
      {
        text: 'Open Modal',
        callback: function(t){
          return t.modal({            
            url: './modal.html', // The URL to load for the iframe
            args: { text: 'Hello' }, // Optional args to access later with t.arg('text') on './modal.html'
            accentColor: '#F2D600', // Optional color for the modal header 
            height: 500, // Initial height for iframe; not used if fullscreen is true
            fullscreen: true, // Whether the modal should stretch to take up the whole screen
            callback: () => console.log('Goodbye.'), // optional function called if user closes modal (via `X` or escape)
            title: 'Hello, Modal!', // Optional title for modal header
            // You can add up to 3 action buttons on the modal header - max 1 on the right side.
            actions: [{
              icon: GRAY_ICON,
              url: 'https://google.com', // Opens the URL passed to it.
              alt: 'Leftmost',
              position: 'left',
            }, {
              icon: GRAY_ICON,
              callback: (tr) => tr.popup({ // Callback to be called when user clicks the action button.
                title: 'Settings',
                url: 'settings.html',
                height: 164,
              }),
              alt: 'Second from left',
              position: 'left',
            }, {
              icon: GRAY_ICON,
              callback: () => console.log('🏎'),
              alt: 'Right side',
              position: 'right',
            }],
          })
        }
      },
      {
        text: 'Open Board Bar',
        callback: function(t){
          return t.boardBar({
            url: './board-bar.html',
            height: 200
          })
          .then(function(){
            return t.closePopup();
          });
        }
      }
    ]
  });
};

var cardButtonCallback = function(t){
  // Trello Power-Up Popups are actually pretty powerful
  // Searching is a pretty common use case, so why reinvent the wheel
  var items = ['acad', 'arch', 'badl', 'crla', 'grca', 'yell', 'yose'].map(function(parkCode){
    var urlForCode = 'http://www.nps.gov/' + parkCode + '/';
    var nameForCode = '🏞 ' + parkCode.toUpperCase();
    return {
      text: nameForCode,
      url: urlForCode,
      callback: function(t){
        // In this case we want to attach that park to the card as an attachment
        // but first let's ensure that the user can write on this model
        if (t.memberCanWriteToModel('card')){
          return t.attach({ url: urlForCode, name: nameForCode })
          .then(function(){
            // once that has completed we should tidy up and close the popup
            return t.closePopup();
          });
        } else {
          console.log("Oh no! You don't have permission to add attachments to this card.")
          return t.closePopup(); // We're just going to close the popup for now.
        };
      }
    };
  });

  // we could provide a standard iframe popup, but in this case we
  // will let Trello do the heavy lifting
  return t.popup({
    title: 'Popup Search Example',
    items: items, // Trello will search client-side based on the text property of the items
    search: {
      count: 5, // How many items to display at a time
      placeholder: 'Search National Parks',
      empty: 'No parks found'
    }
  });
  
  // in the above case we let Trello do the searching client side
  // but what if we don't have all the information up front?
  // no worries, instead of giving Trello an array of `items` you can give it a function instead
  /*
  return t.popup({
    title: 'Popup Async Search',
    items: function(t, options) {
      // use options.search which is the search text entered so far
      // and return a Promise that resolves to an array of items
      // similar to the items you provided in the client side version above
    },
    search: {
      placeholder: 'Start typing your search',
      empty: 'Huh, nothing there',
      searching: 'Scouring the internet...'
    }
  });
  */
};

var addYTCardButtonCallback = function (t, opt) {
  return t.popup({
    title : "Add YouTube Link",
    url: './inputData.html'
  });
};

var addSocialLinksButtonCallback = function (t, opt) {
  return t.popup({
    title : "Add Social Links",
    url: './inputSocialLinks.html'
  });
};

// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
  // NOTE about asynchronous responses
  // If you need to make an asynchronous request or action before you can reply to Trello
  // you can return a Promise (bluebird promises are included at TrelloPowerUp.Promise)
  // The Promise should resolve to the object type that is expected to be returned
  'attachment-sections': function(t, options){
    // options.entries is a list of the attachments for this card
    // you can look through them and 'claim' any that you want to
    // include in your section.

    // we will just claim urls for Yellowstone
    var claimed = options.entries.filter(function(attachment){
      return attachment.url.indexOf('https://www.youtube.com/') === 0 || attachment.url.indexOf('https://m.youtube.com/') === 0 || attachment.url.indexOf('https://youtu.be/') === 0 || attachment.url.indexOf('https://www.twitter.com') === 0 || attachment.url.indexOf('https://twitter.com') === 0 || attachment.url.indexOf('https://mobile.twitter.com') === 0;
    });

    // you can have more than one attachment section on a card
    // you ca group items together into one section, have a section
    // per attachment, or anything in between.
    if(claimed && claimed.length > 0){
      attachments = []
      for (i=0; i<claimed.length; i++){
      // if the title for your section requires a network call or other
      // potentially length operation you can provide a function for the title
      // that returns the section title. If you do so, provide a unique id for
      // your section
      if (claimed[i].url.startsWith("https://www.twitter.com/") || claimed[i].url.startsWith("https://twitter.com/") || claimed[i].url.startsWith("https://mobile.twitter.com/")){
        attachments.push({
        id: 'SocialLinks', // optional if you aren't using a function for the title
        claimed: claimed,
        icon:  YOUTUBE_GRAY,
        title: 'Social Feeds',
        content: {
          type: 'iframe',
          url: t.signUrl('./sectionSocialLinks.html', {fbUrl:claimed[i].url }),
          height: 500
        }
      })
    }else{
      attachments.push({
        id: 'YouTube', // optional if you aren't using a function for the title
        claimed: claimed,
        icon:  YOUTUBE_GRAY,
        title: 'Video Attachment',
        content: {
          type: 'iframe',
          url: t.signUrl('./section.html', { ytUrl: claimed[i].url }),
          height: 230
        }
      })
    }
    }
      return attachments;
      
      
    } else {
      return [];
    }
  },
  'attachment-thumbnail': function(t, options){
    // options.url has the url of the attachment for us
    // return an object (or a Promise that resolves to it) with some or all of these properties:
    // url, title, image, modified (Date), created (Date), createdBy, modifiedBy
    
    // You should use this if you have useful information about an attached URL but it
    // doesn't warrant pulling it out into a section via the attachment-sections capability
    // for example if you just want to show a preview image and give it a better name
    // then attachment-thumbnail is the best option
    return {
      url: options.url,
      title: '👉 ' + options.url + ' 👈',
      image: {
        url: GLITCH_ICON,
        logo: true // false if you are using a thumbnail of the content
      },
    };
    
    // if we don't actually have any valuable information about the url
    // we can let Trello know like so:
    // throw t.NotHandled();
  },
  'board-buttons': function(t, options){
    return [{
      icon: WHITE_ICON,
      text: 'Popup',
      callback: boardButtonCallback
    }, {
      // or we can also have a button that is just a simple url
      // clicking it will open a new tab at the provided url
      icon: WHITE_ICON,
      text: 'URL',
      url: 'https://trello.com/inspiration',
      target: 'Inspiring Boards' // optional target for above url
    }];
  },
  'card-badges': function(t, options){
    let cardAttachments = options.attachments;
    isYtVidAvail = false;
    for(i=0; i<cardAttachments.length;i++){
      if (cardAttachments[i].url.startsWith('https://www.youtube.com/') || cardAttachments[i].url.startsWith('https://m.youtube.com/') || cardAttachments[i].url.startsWith('https://youtu.be/')){
        isYtVidAvail = true;
      }
  }
  if (isYtVidAvail){
    return [ {
      icon: YOUTUBE
    }];
  }else{
    return [];
  }

    
  },
  'card-buttons': function(t, options) {
    return [{
      // usually you will provide a callback function to be run on button click
      // we recommend that you use a popup on click generally
      icon: GRAY_ICON, // don't use a colored icon here
      text: 'Add YouTube',
      callback: addYTCardButtonCallback
    }, {
      // usually you will provide a callback function to be run on button click
      // we recommend that you use a popup on click generally
      icon: GRAY_ICON, // don't use a colored icon here
      text: 'Add Social Links',
      callback: addSocialLinksButtonCallback
    }];
  },
  'card-detail-badges': function(t, options) {
    return getBadges(t);
  },
  'card-from-url': function(t, options) {
    // options.url has the url in question
    // if we know cool things about that url we can give Trello a name and desc
    // to use when creating a card. Trello will also automatically add that url
    // as an attachment to the created card
    // As always you can return a Promise that resolves to the card details
    
    return new Promise(function(resolve) {
      resolve({
        name: '💻 ' + options.url + ' 🤔',
        desc: 'This Power-Up knows cool things about the attached url'
      });
    });
    
    // if we don't actually have any valuable information about the url
    // we can let Trello know like so:
    // throw t.NotHandled();
  },
  'format-url': function(t, options) {
    // options.url has the url that we are being asked to format
    // in our response we can include an icon as well as the replacement text
    
    return {
      icon: GRAY_ICON, // don't use a colored icon here
      text: '👉 ' + options.url + ' 👈' 
    };
    
    // if we don't actually have any valuable information about the url
    // we can let Trello know like so:
    // throw t.NotHandled();
  },
  'show-settings': function(t, options){
    // when a user clicks the gear icon by your Power-Up in the Power-Ups menu
    // what should Trello show. We highly recommend the popup in this case as
    // it is the least disruptive, and fits in well with the rest of Trello's UX
    return t.popup({
      title: 'Settings',
      url: './settings.html',
      height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
    });
  },
  
  /*        
      
      🔑 Authorization Capabiltiies 🗝
      
      The following two capabilities should be used together to determine:
      1. whether a user is appropriately authorized
      2. what to do when a user isn't completely authorized
      
  */
  'authorization-status': function(t, options){
    // Return a promise that resolves to an object with a boolean property 'authorized' of true or false
    // The boolean value determines whether your Power-Up considers the user to be authorized or not.
    
    // When the value is false, Trello will show the user an "Authorize Account" options when
    // they click on the Power-Up's gear icon in the settings. The 'show-authorization' capability
    // below determines what should happen when the user clicks "Authorize Account"
    
    // For instance, if your Power-Up requires a token to be set for the member you could do the following:
    return t.get('member', 'private', 'token')
    .then(function(token){
      if(token){
        return { authorized: true };
      }
      return { authorized: false };
    });
    // You can also return the object synchronously if you know the answer synchronously.
  },
  'show-authorization': function(t, options){
    // Returns what to do when a user clicks the 'Authorize Account' link from the Power-Up gear icon
    // which shows when 'authorization-status' returns { authorized: false }.
    
    // If we want to ask the user to authorize our Power-Up to make full use of the Trello API
    // you'll need to add your API from trello.com/app-key below:
    let trelloAPIKey = '';
    // This key will be used to generate a token that you can pass along with the API key to Trello's
    // RESTful API. Using the key/token pair, you can make requests on behalf of the authorized user.
    
    // In this case we'll open a popup to kick off the authorization flow.
    if (trelloAPIKey) {
      return t.popup({
        title: 'My Auth Popup',
        args: { apiKey: trelloAPIKey }, // Pass in API key to the iframe
        url: './authorize.html', // Check out public/authorize.html to see how to ask a user to auth
        height: 140,
      });
    } else {
      console.log("🙈 Looks like you need to add your API key to the project!");
    }
  }
});

console.log('Loaded by: ' + document.referrer);