
/* Service module for searching via Twitter API */
var searchMod = (function () {

  /* Private */
  var _getTweets = function (q, successCallback, errorCallback) {
    
    // Callback of request
    tweetRequest = new XMLHttpRequest();
    tweetRequest.onreadystatechange=function()
    {
      if (tweetRequest.readyState==4 && tweetRequest.status==200) {
        var response = JSON.parse(tweetRequest.response);

        if(response.error) {
          // The response has an error proporty, meaning we have some clue what it is.
          errorCallback({"error": response.error});
        }
        else if(response.statuses) {
          // Success. The query went through. May return 0 tweets, though.
          var tweets = response.statuses;
          if(tweets.length > 0) {
            successCallback(tweets);
          }
          else {
            errorCallback({"error":"That query returned no tweets."});
          }
        }
        else {
          // Some odd error we do not know about before occurred.
          errorCallback();
        }
        
      }
    }

    // URI encode q variable to allow @, #, etc.
    var uriEncodedQ = encodeURIComponent(q);

    var options = {
      count: 10,
      result_type: "recent"
    }

    // Send tequest to search app.
    // Change to allow dynamic options.
    tweetRequest.open("GET",
      "https://pacific-wave-3436.herokuapp.com/tweets/search"
      +"?q="+uriEncodedQ+"&count="+options.count+"&result_type="+options.result_type,
      true);
    tweetRequest.send();

  };

  /* Public */
  // Search Twitter with any query.
  var search = function (q, successCallback, errorCallback) {
    _getTweets(q, successCallback, errorCallback);
  };

  // Search Twitter with hashtag
  // NOT USED
  var hashtagSearch = function (hashtag, successCallback, errorCallback) {
    hashtag.match("\b#\w\w+");
    _getTweets(hashtag, successCallback, errorCallback);
  };
  
  return {
    search: search,
    //hashtagSearch: hashtagSearch
  };

})();

/* Class for a list of tweets */
var TweetList = (function() {

  /* Properties */
  // The list node where we put the tweets.
  var _listElement;

  /* Constructor */
  function tweetList(listId) {
    _listElement = document.getElementById(listId);
  };

  /* Public methods */
  var baseObject = {
    // Clear list of all items
    clear: function() {
      _listElement.innerHTML = '';
    },
    // Append a single tweet
    addTweet: function(tweet) {
      var el = _createListItem(tweet);
      _listElement.appendChild(el);
    },
    // Append multiple tweets
    addTweets: function(tweets) {
      for(var i = 0; i < tweets.length; i++) {
        var el = _createListItem(tweets[i]);
        _listElement.appendChild(el);
      }
    }
  };
  tweetList.prototype = baseObject;

  /* Private methods */
  // Creates a ready to append li from a API tweet
  function _createListItem(tweet) {

    // Base node
    var liNode = document.createElement("li");

    // Tweet author name
    var nameNode = document.createElement("h3");
    nameNode.innerHTML = tweet.user.name;
    nameNode.setAttribute("class", "tweet-author-name");
    liNode.appendChild(nameNode);

    // Tweet author screen_name (@-name) and link to profile
    var usernameNode = document.createElement("p");
    usernameNode.setAttribute("class", "tweet-author-screen_name");

    var profileLinkNode = document.createElement("a");
    profileLinkNode.setAttribute("href", "https://twitter.com/"+tweet.user.screen_name);
    profileLinkNode.innerHTML = "@" + tweet.user.screen_name;

    usernameNode.appendChild(profileLinkNode);
    liNode.appendChild(usernameNode);

    // Tweet text content
    var textNode = document.createElement("p");
    textNode.innerHTML = tweet.text;
    textNode.setAttribute("class", "tweet-text");
    liNode.appendChild(textNode);

    // Statistics for the tweet
    var statNode = document.createElement("p");

    // Nr retweets
    var retweetNode = document.createElement("span");
    retweetNode.innerHTML = "Retweets: " + tweet.retweet_count;
    statNode.appendChild(retweetNode);

    // Posted x minutes ago.
    var createdAtNode = document.createElement("span");
    createdAtNode.setAttribute("class", "tweet-created-at");
    createdAtNode.innerHTML = tweet.created_at;
    statNode.appendChild(createdAtNode);

    liNode.appendChild(statNode);
    
    return liNode;
  }

return tweetList; })();