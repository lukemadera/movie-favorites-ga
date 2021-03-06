/**
Set an array to hold all the movies. The format is:
var movies =[
  {
    imbdID: 'movieId1',
    Title: 'title 1',
    Poster: 'http://image.jpg',
    favorite: false
  }
];

Note: this is a global variable currently; in general we do NOT want to
put variables in the global namespace as this could cause naming conflicts
and can degrade performance.
*/
var movies =[];

/**
Initialization function that should only be run AFTER the window has loaded
 and the elements are on the page. Otherwise the event handler binding will
 fail as they do not exist yet!
*/
function initMovies() {
  initEvents();
}

function initEvents() {
  // Set up click handler for movie search button and input `enter` key press.
  // Use a function since we'll do the same thing for both event handlers.
  var searchMoviesHandler =function() {
    var searchInput =eleById('movieSearchInput');
    // To get the text the user typed in an input, get the input element and
    // then use `.value`.
    var searchText =searchInput.value;
    searchMovies(searchText);
  };

  // If click button, search.
  eleById('movieSearchButton').onclick =function() {
    searchMoviesHandler();
  };
  // If hit 'Enter' key on keyboard when in input, search.
  eleById('movieSearchInput').onkeyup =function(evt) {
    // The key code for enter is `13`
    // http://www.cambiaresearch.com/articles/15/javascript-key-codes
    if(evt.keyCode ===13) {
      searchMoviesHandler();
    }
  };
}

/**
Search for movies by making an AJAX call to the http://www.omdbapi.com/ API.
Note: this currently does not handle paging; it will just return the first 10
 movies.
*/
function searchMovies(searchText) {
  // If empty search, do not search at all, just empty out the movies list.
  if(!searchText || searchText.length <1) {
    movies =[];
    // The HTML element has an id of 'movieResults' so we hardcode that here.
    displayMovies(movies, true, true, 'movieResults');
    return;
  }

  // Use the OMDb API to look up movies (by title)
  var url ="http://www.omdbapi.com/";
  // Append the search term.
  // Note that is this is the FIRST parameter we are adding, we use a '?' in
  // front of it.
  url +="?s="+searchText;
  // Append some additional parameters as per http://www.omdbapi.com/
  // As these are AFTER the first parameter, we'll prepend with a '&'.
  url +="&type=movie&r=json";

  // Use a helper function in `helpers.js` that is an asynchronous call.
  // That means it does NOT return immediately. Instead, the 3rd parameter
  // we pass is a function, which will be called when the data is ready.
  // This is commonly called a `callback` function.
  ajax(url, "GET", null, function(response) {
    // Now we have new movies, so update our local `movies` variable.
    setMovies(response);
    // Now that we have added in the new movie data, display them.
    // The HTML element has an id of 'movieResults' so we hardcode that here.
    displayMovies(movies, true, true, 'movieResults');
  });
}

/**
Takes movie data from http://www.omdbapi.com/ and re-formats it how we want it
 in our `movies` array of objects.
*/
function setMovies(movieData) {
  // First blank out the movies.
  movies =[];

  // Do some error handling here in case we do not get
  // back data in the format we expect.
  if(!movieData || !movieData.Response || !movieData.Search || !movieData.Search.length) {
    return;
  }
  movieData.Search.forEach(function(movie) {
    movies.push({
      imdbID: movie.imdbID,
      Title: movie.Title,
      Poster: movie.Poster,
      // Boolean to hide favorite button after clicked.
      // Note: it would be nice to already set favorite to true if the user
      // has already favorited it. We would have to look up the favorites and
      // compare that list to each movie.
      favorite: false
    });
  });
}

/**
Render the movies stored in the `movies` array
*/
function displayMovies(moviesData, showFavorite, showDetails, elementId) {
  // Start with empty HTML.
  var html ="";
  // We will iterate through each movie and added to the existing HTML.
  var ii;
  var idFavorite;
  for(ii =0; ii<moviesData.length; ii++) {
    idFavorite = moviesData[ii].imdbID + 'Favorite';
    html += "<div class='movie'>" +
      "<div id='" + moviesData[ii].imdbID + "' >" +
        "<img src='" + moviesData[ii].Poster + "' class='movie-img'/>" +
        moviesData[ii].Title +
      "</div>" ;
    if(showFavorite && !moviesData[ii].favorite) {
      html += "<button id='" + idFavorite + "' class='movie-favorite'>" +
        "Favorite" +
      "</button>";
    }
    html += "</div>";
  }

  // We will update ALL the content for the element with our newly formed
  // string of HTML that has all the movies.
  eleById(elementId).innerHTML =html;

  // Add click handlers
  for(ii =0; ii<moviesData.length; ii++) {
    // Need closure inside for loop, otherwise the `ii` reference will not be
    // accurate for each iteration of the loop.
    (function(ii) {
      if(showDetails) {
        // We use the id that we set above - `moviesData[ii].imdbID`
        eleById(moviesData[ii].imdbID).onclick =function() {
          getMovieDetails(moviesData[ii].imdbID);
        };
      }

      // Add click handler for favorite too.
      if(showFavorite && !moviesData[ii].favorite) {
        idFavorite = moviesData[ii].imdbID + 'Favorite';
        eleById(idFavorite).onclick =function() {
          saveMovieFavorite(moviesData[ii]);
        };
      }
    })(ii);
  }
}

function getMovieDetails(movieId) {
  // If we wanted to get more information on the movie, we could, but for this
  // case all we need is the movie id, which we already have.
  // // Default movie to null in case it is not found, though that should NOT happen.
  // var movie =null;
  // var ii;
  // // Go through movies to match by id.
  // for(ii =0; ii<movies.length; ii++) {
  //   if(movieId ===movies[ii].imdbID) {
  //     movie =movies[ii];
  //     // If found, we are done, so break.
  //     break;
  //   }
  // }

  // Use helper AJAX function to look up movie details
  var url ="http://www.omdbapi.com/?i=" + movieId + "&type=movie&r=json&tomatoes=true&";
  ajax(url, "GET", null, function(response) {
    // Now we have movie details, so update HTML.
    displayMovieDetails(response);
  });
}

function displayMovieDetails(info) {
  var html ="";
  // We will iterate through the `info` object and output each key and value.
  // Note: there may be fields (keys) we do NOT want to output to the user.
  // We could add a `skip` array variable to skip these keys if we wanted.
  var key;
  for(key in info) {
    html += "<div>" + key + ": " + info[key] + "</div>";
  }
  eleById('movieDetails').innerHTML =html;
}

function saveMovieFavorite(movie) {
  // This time we call our own backend, so no `http://` in front.
  var url ="/favorites";
  var data ="imdbID=" + movie.imdbID + "&Title=" + movie.Title + "&Poster=" + movie.Poster;
  ajax(url, "POST", data, function(response) {
    // Mark this movie as favorited and then re-display movies.
    var index =getMovieIndexById(movie.imdbID);
    if(index > -1) {
      movies[index].favorite =true;
      // The HTML element has an id of 'movieResults' so we hardcode that here.
      displayMovies(movies, true, true, 'movieResults');
    }
  });
}

function getMovieIndexById(movieId) {
  var ii;
  for(ii =0; ii<movies.length; ii++) {
    // Convert both to strings in case one is not.
    if(movies[ii].imdbID.toString() === movieId.toString()) {
      return ii;
    }
  }
  // If not found, return -1, which is not a valid index.
  return -1;
}