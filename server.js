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
  var filePath ='./data.json';
  var data =[];
  if(fs.existsSync(filePath)) {
    data = fs.readFileSync(filePath);
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.get('/my-favorites', function(req, res) {
  // Need to get the absolute path from this directory.
  res.sendFile(__dirname + '/public/my-favorites.html');
});

// Update favorites by inserting a new one.
app.post('/favorites', function(req, res) {
  if(!req.body.imdbID || !req.body.Title) {
    res.send([]);
    return;
  }
  var body =req.body;
  
  var filePath ='./data.json';
  // Start as string to match json file format.
  var data ="[]";
  if(fs.existsSync(filePath)) {
    data = fs.readFileSync(filePath);
  }
  data = JSON.parse(data);

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
app.get('*', function(req, res) {
  // Need to get the absolute path from this directory.
  res.sendFile(__dirname + '/public/index.html');
});

app.listen((process.env.PORT || 3000), function() {
  console.log("Listening on port 3000");
});