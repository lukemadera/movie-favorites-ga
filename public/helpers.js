/**
Get a DOM element by id.
*/
function eleById(id) {
  return document.getElementById(id);
}

/**
http://stackoverflow.com/questions/8567114/how-to-make-an-ajax-call-without-jquery
*/
function ajax(url, type, callback) {
  console.log('ajax call starting');
  var type = type || 'GET';

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
      console.log('ajax call done');
      if(xmlhttp.status == 200) {
        callback( JSON.parse(xmlhttp.responseText) );
      }
      else {
        alert('something else other than 200 was returned');
      }
    }
  }
  xmlhttp.open(type, url, true);
  xmlhttp.send();
}