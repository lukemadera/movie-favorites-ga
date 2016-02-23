/**
Set an array to hold all the favorites (movies). The format is:
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
var favorites =[];

/**
Initialization function that should only be run AFTER the window has loaded
 and the elements are on the page. Otherwise the event handler binding will
 fail as they do not exist yet!
*/
function initFavorites() {
  getFavorites();
}

function getFavorites() {
  // Call our own backend, so no `http://` in front.
  var url ="/favorites";
  ajax(url, "GET", null, function(response) {
    // Use the same function on the main page, but do NOT show favorites button.
    displayMovies(response, false, false, 'favoritesResults');
  });
}