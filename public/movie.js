/**
Set an array to hold all the movies. The format is:
var movies =[
  {
    id: 'movieId1'
  }
];

Note: this is a global variable currently; in general we do NOT want to
put variables in the global namespace as this could cause naming conflicts
and can degrade performance.
*/
var movies =[];

/**
Helper function to get a DOM element by id.
*/
function eleById(id) {
  return document.getElementById(id);
}

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

  console.log(url);
  // TODO
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
    html += "<div>" + movies[ii].title + "</div>";
  }

  // The HTML element has an id of 'movieResults' so we hardcode that here.
  // We will update ALL the content for the element with our newly formed
  // string of HTML that has all the movies.
  eleById('movieResults').innerHTML =html;
}