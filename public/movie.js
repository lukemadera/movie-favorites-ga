/**
Set an array to hold all the movies. The format is:
var movies =[
  {
    imbdID: 'movieId1',
    Title: 'title 1',
    Poster: 'http://image.jpg'
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
function init() {
  initEvents();
}

function initEvents() {
  // Set up click handler for movie search button.
  eleById('movieSearchButton').onclick =function() {
    var searchInput =eleById('movieSearchInput');
    // To get the text the user typed in an input, get the input element and
    // then use `.value`.
    var searchText =searchInput.value;
    searchMovies(searchText);
  };
}

function searchMovies(searchText) {
  // If empty search, do not search at all, just empty out the movies list.
  if(!searchText || searchText.length <1) {
    movies =[];
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
  ajax(url, "GET", function(response) {
    // Now we have new movies, so update our local `movies` variable.
    setMovies(response);
    // Now that we have added in the new movie data, display them.
    displayMovies();
  });
}

/**
Takes movie data from http://www.omdbapi.com/ and re-formats it how we want it
 in our `movies` array of objects.
*/
function setMovies(movieData) {
  console.log(movieData);
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
      Poster: movie.Poster
    });
  });

  console.log(movies);
}

/**
Render the movies stored in the `movies` array
*/
function displayMovies() {
  // Start with empty HTML.
  var html ="";
  // We will iterate through each movie and added to the existing HTML.
  var ii;
  for(ii =0; ii<movies.length; ii++) {
    html += "<div id='" + movies[ii].imdbID + "' class='movie'>" +
      "<img src='" + movies[ii].Poster + "' class='movie-img'/>" +
      movies[ii].Title +
    "</div>";
  }

  // The HTML element has an id of 'movieResults' so we hardcode that here.
  // We will update ALL the content for the element with our newly formed
  // string of HTML that has all the movies.
  eleById('movieResults').innerHTML =html;
}