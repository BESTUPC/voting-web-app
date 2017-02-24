var express = require('express')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var fs = require('fs');
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var obj = JSON.parse(fs.readFileSync('googlecredentials.pswd', 'utf8'));
var CLIENT_ID = obj['id'];
var CLIENT_SECRET = obj['secret'];
var client = new auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "http://localhost:3000/");
var bodyParser = require("body-parser");
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

//Create the stub, this should be deleted on the final version
MongoClient.connect(url, function(err, db) {
  var user = {};
  user['userId'] = "102462623932080066899";
  user['membership'] = ["admin", "full", "all"];
  user['name'] = "Petter Varlac";
  user['email'] = "petter@best.com";
  db.collection('users').insertMany([user], function(err, result) {});
  var votacio = {};
  votacio['_id'] = "3456789";
  votacio['pollName'] = "Bestie de la biSetmana";
  votacio['pollOptions'] = ["Iñigo", "Quesito", "Bernat", "Laia"];
  votacio['targetGroup'] = "all";
  votacio['isPrivate'] = false;
  votacio['pollDeadline'] = "3234672825";
  votacio['description'] = "descripció ... why?";
  db.collection('votacions').insertMany([votacio], function(err, result){});
  var vote = {};
  vote['pollId'] = "3456789";
  vote['userId'] = "102462623932080066899";
  vote['pollOption'] = "Bernat";
  db.collection('votes').insertMany([vote], function(err, result){});
  var withdrawal = {};
  withdrawal['pollId'] = "3456789";
  withdrawal['userId'] = "102462623932080066899";
  db.collection('askWithdrawal').insertMany([withdrawal], function(err, result){});
  var privat = {};
  privat['pollId'] = "3456789";
  privat['userId'] = "102462623932080066899";
  db.collection('askPrivate').insertMany([privat], function(err, result){});
  db.close();
});


//Creating the webserver
var app = express();

//making files in public served at /
app.use(express.static('public'))

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.post('/getPolls', function (req, res) {
// Stub
  var token = req.body.idtoken;
  if (token == "" || token == undefined){
    console.log("Token not defined");
    return 1;
  }
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(e, login) {
      if (e) throw e;
      var payload = login.getPayload();
      console.log(payload);
      MongoClient.connect(url, function(err, db) {
        var users = db.collection('users');
        var user = {};
        user['userId'] = payload['sub'];
        users.findOne({userId: user['userId']},{fields:{membership:1}}, function(err, document) {
          if(document == null) {
            console.log('document not found on DB');
            return 1;
          }
          console.log('document:', document);
          var memberships = document['membership'];
          var votacions = db.collection('votacions');
          votacions.find({targetGroup : { $in: memberships }}).toArray(function (err, docs) {
            if (err) throw err;
            db.collection('votes').findOne({pollId: docs._id , userId: user['userId'] }, function(err, ret) {
              if (ret == null) docs['pollOption'] = "";
              else docs['pollOption'] = ret.pollOption;
              res.json(docs);
            });
          });
          db.close();
        });

      });
    });
  });

app.post('/getPollInfo', function (req, res) {
  var token = req.body.idtoken;
  var ipollId = req.body.pollId;
  console.log(token)
  console.log(ipollId)
  if (token == "" || token == undefined){
    console.log("Token not defined");
    return 1;
  }
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(e, login) {
      if (e) throw e;
      var payload = login.getPayload();
      console.log(payload);
      MongoClient.connect(url, function(err, db)
        {
          db.collection('votacions').findOne({pollId : ipollId}, function (err, docs) 
            {
              if (err) throw err;
              if(docs == null)
              {
                console.log('poll not found in db');
                return 1;
              }
              db.collection('votes').findOne({pollId: ipollId , userId: payload['sub'] }, function(err, ret)
                {
                if (ret == null) docs['pollOption'] = "";
                else docs['pollOption'] = ret.pollOption;
                res.json(docs);
                db.close();
                });
            });
        });
    });
})

app.post('/sendVote', function (req, res) {
  var ret = {};
  ret['status'] = 0;
  res.json(ret);
})

app.post('/askWithdrawal', function (req, res) {
  var ret = {};
  ret['status'] = 0;
  res.json(ret);
})

app.post('/askPrivate', function (req, res) {
  var ret = {};
  ret['status'] = 0;
  res.json(ret);
})

app.post('/getResults', function (req, res) {
  var option = {};
  option['option'] = "Juanito";
  option['numberVotes'] = 25;
  option['autors'] = ["Quesito", "Berni", "Adolfo"];
  var ret = [option,option];
  res.json(ret);
})

app.post('/getMembership', function (req, res) {
  var user_ID = req.body.userId;
  MongoClient.connect(url, function(err, db) {
    var users = db.collection('users');
    users.findOne({userId: user_ID}, function(err, ret) {
      res.json(ret.membership);
    });
    db.close();
  });
})

app.post('/createPoll', function (req, res) {
  var ret = {};
  ret['status'] = 0;
  res.json(ret);
})

app.post('/addMembership', function (req, res) {
  var token = req.body.idtoken;
  if (token == "" ){
    console.log("Token not defined");
    return 1;
  }
  console.log(token);
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(e, login) {
      if (e) throw e;
      var payload = login.getPayload();
      MongoClient.connect(url, function(err, db) {
        var users = db.collection('users');
        users.findOne({userId: payload['sub']}, function(err, ret) {
          var isadmin = false;
          var member_status = ret.membership;
          for(var i = 0; i < member_status.length; ++i){
            isadmin = (["admin"] == member_status[i]);
          }
          if (isadmin){
            var email_to_add = req.body.email;
            var membership_to_add = req.body.newMembership;
            users.findOne({email: email_to_add}, function(err, ret) {
              var found = false;
              var to_add_status=ret.membership;
              for(var i = 0; i < to_add_status.length; ++i){
                found = (to_add_status[i] == membership_to_add);
              }
              if(!found){
                to_add_status.push(membership_to_add);
                users.updateOne({email: email_to_add}, {$set: {membership: to_add_status}});
                res.json(0);
                db.close();
              }
              else db.close();
            });

          }
          else res.json(1);
        });

      });
    });
})

app.post('/revokeMembership', function (req, res) {
  var ret = ["full"];
  res.json(ret);
})


app.post('/tokensignin', function (req, res) {
  var token = req.body.idtoken;
  console.log(token);
  if (token == "" ){
    console.log("Token not defined");
    return 1;
  }
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(e, login) {
      var payload = login.getPayload();
      MongoClient.connect(url, function(err, db) {
        var users = db.collection('users');
        var user = {};
        user['userId'] = payload['sub'];
        user['membership'] = ['all'];
        user['name'] = payload['name'];
        user['email'] = payload['email'];
        users.insertMany([user], function(err, result) {});
        db.close();
      });
    });
})

app.listen(3000, function () {
  console.log('App listening on port 3000!')
})
