document.addEventListener("DOMContentLoaded", function(event) {

  // Create list where we put the tweets.
  var list = new TweetList("tweet-list");

  // Handle search form
  var searchForm = document.getElementById("search-form");
  var searchText = document.getElementById("search-text");

  searchForm.addEventListener("submit", function(event) {

    // Clear eventual error message.
    var errorParagraph = document.getElementById("search-error-report");
    errorParagraph.innerHTML = "";

    if(searchText.value.length < 1) {
      errorParagraph.innerHTML = "Error: You need to enter a search query.";

    }
    else {

      // Clear list.
      list.clear();

      // Search, with callbacks for success and error.
      searchMod.search(
        searchText.value,
        function(response) {
          // Success!
          list.addTweets(response);
        },
        function(msg) {
          // Some error or other was returned from the app.
          var errorParagraph = document.getElementById("search-error-report");

          var error = msg.error;

          if(error) {
            var errorString
            if(error[0].code == 195) {
              errorParagraph.innerHTML = "Error: The query entered is invalid.";
            } else {
              errorParagraph.innerHTML = error;
            }
          }
          else {
            errorParagraph.innerHTML = "Unknown error";
          }
          
        }
      );
    }

  });

});