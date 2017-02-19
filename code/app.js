var express = require('express')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');

//Connection to mongodb
// Connection URL
var url = 'mongodb://localhost:27017/votacions';

// Use connect method to connect to the server and creates unique indexes
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  db.collection('users').createIndex( { "userId" : 1}, { unique: true} );
  db.collection('votes').createIndex( {"pollId" : 1, "userId" : 1}, { unique: true});
  db.collection('askWithdrawal').createIndex( {"pollId" : 1, "userId" : 1}, { unique: true});
  db.collection('askPrivate').createIndex( {"pollId" : 1, "userId" : 1}, { unique: true});
  console.log("Connected successfully to server");
  db.close();
});

//Creating the webserver
var app = express();

//making files in public served at /
app.use(express.static('public'))


app.get('/', function (req, res) {
  var options = {
    root: __dirname + '/public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };
  res.sendFile("index.html", options, function (err) {
   if (err) {
     next(err);
   } else {
     console.log('Sent:', fileName);
   }
 });
})


app.get('/getPolls', function (req, res) {
  var poll = {};
  poll['pollId'] = 254235;
  poll['pollName'] = "Bestie de la biSetmana";
  poll['pollOptions'] = ["Esteve", "Iñigo", "Arnau"];
  poll ['pollDeadline'] = 1487335573;
  poll['isPrivate'] = 0;
  poll['targetGroup'] = "members";
  var ret = [poll];
  res.json(ret);
})

app.get('/getPollsId', function (req, res) {
  var ret = [224,228,229];
  res.json(ret);
})

app.get('/getPollInfo', function (req, res) {
  var poll = {};
  poll['pollId'] = 254235;
  poll['pollName'] = "Bestie de la biSetmana";
  poll['pollOptions'] = ["Esteve", "Iñigo", "Arnau"];
  poll ["pollDeadline"] = 1487335573;
  poll['isPrivate'] = 0;
  poll['targetGroup'] = "members";
  var ret = poll;
  res.json(poll);
})

app.get('/sendVote', function (req, res) {
  var ret = {};
  ret['status'] = 0;
  res.json(ret);
})

app.get('/askWithdrawal', function (req, res) {
  var ret = {};
  ret['status'] = 0;
  res.json(ret);
})

app.get('/askPrivate', function (req, res) {
  var ret = {};
  ret['status'] = 0;
  res.json(ret);
})

app.get('/getResults', function (req, res) {
  var option = {};
  option['option'] = "Juanito";
  option['numberVotes'] = 25;
  option['autors'] = ["Quesito", "Berni", "Adolfo"];
  var ret = [option,option];
  res.json(ret);
})

app.get('/getMembership', function (req, res) {
  var ret = ["admin","full"];
  res.json(ret);
})

app.get('/createPoll', function (req, res) {
  var ret = {};
  ret['status'] = 0;
  res.json(ret);
})

app.get('/addMembership', function (req, res) {
  var ret = ["admin","full","member"];
  res.json(ret);
})

app.get('/revokeMembership', function (req, res) {
  var ret = ["full"];
  res.json(ret);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.get('/addUser', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    var users = db.collection('users');
    var user = {};
    user['userId'] = req.query.newUser;
    user['membership'] = ['all'];
    users.insertMany([user], function(err, result) {
      assert.equal(err, null);
      console.log("Inserted a new user on the collection");
      }
    );
    db.close();
  });
  var ret = {};
  ret['status'] = 0;
  res.json(ret);
})
