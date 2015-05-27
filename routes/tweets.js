var Express = require('express');
var Twitter = require('twitter');
var Cors = require('cors');
var Promise = require('bluebird');
var URL = require('url');

var router = Express.Router();

// Twitter setup
var twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// CORS allowed origins
// TODO: Do not allow all origins...
var whitelist = ['http://awarnhag.se'];
var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    //var originIsWhitelisted = true;
    callback(null, originIsWhitelisted);
  }
};


// Asynch search for tweets returning promise.
function twitterSearchAsync(search, options) {

  return new Promise(function(resolve,reject){

    twitterClient.get('search/tweets', 
      {q: search, result_type: options.result_type, count: options.count}, 
      function(error, tweets, response){

        if(error) {
          reject(error);
        }

        if(tweets) {
          resolve(tweets);
        }
      
      }
    );

  });
}

// Asynch search for tweets
function search(q) {
  twitterClient.get('search/tweets', {q: q}, function(error, tweets, response){
    console.log(tweets);
  });
}

/* GET Search for tweets */
router.get('/search', Cors(), function(req, res, next) {

  // Taking care of GET paramaters
  var query = URL.parse(req.url, true).query;

  // The search term.
  var q = query.q;

  // Handling some options for the search.
  var options = {};
  options.result_type = query.result_type ? query.result_type : "recent";
  options.count = query.count ? query.count : 10;

  // Send search request and wait for promise.
  twitterSearchAsync(q, options).then(function(tweets) {
    res.setHeader('Content-Type', 'application/json');
    res.jsonp(tweets);
  }).catch(function(error) {
    console.log("error getting tweets: " + error);
    res.send("error getting tweets: " + error);
  });

});

module.exports = router;