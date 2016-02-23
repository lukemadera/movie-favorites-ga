var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Get favorites (from JSON file).
app.get('/favorites', function(req, res) {
  var data = fs.readFileSync('./data.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

// Update favorites by inserting a new one.
app.post('/favorites', function(req, res) {
  if(!req.body.imdbID || !req.body.Title) {
    res.send([]);
    return;
  }
  var body =req.body;
  
  var data = JSON.parse(fs.readFileSync('./data.json'));

  // Check if favorite already exists.
  // var exists =false;
  var ii;
  for(ii =0; ii<data.length; ii++) {
    if(data[ii].imdbID ===body.imdbID) {
      // exists =true;
      res.send([]);
      return;
    }
  }

  data.push(body);
  fs.writeFile('./data.json', JSON.stringify(data));
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

//catch all route to serve index.html (main frontend app)
app.get('*', function(req, res){
  res.sendFile('/index.html');
});

app.listen(3000, function() {
  console.log("Listening on port 3000");
});