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
  if(!req.body.name || !req.body.oid) {
    res.send("Error");
    return;
  }
  
  var data = JSON.parse(fs.readFileSync('./data.json'));
  data.push(req.body);
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