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
/* Stub
    var poll = {};
    poll['pollId'] = 254235;
    poll['pollName'] = "Bestie de la biSetmana";
    poll['pollOptions'] = ["Esteve", "Iñigo", "Arnau"];
    poll ['pollDeadline'] = 1487335573;
    poll['isPrivate'] = 0;
    poll['voted'] = "Arnau";
    poll['description'] = "soc una poll random";
    poll['targetGroup'] = "members";
    var ret = [poll,poll,poll];
    res.json(ret);
    return 0;
  */
  var token = req.body.idtoken;
  if (token == "" ){
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
          console.log('document:', document);
          var memberships = document['membership'];
          var votacions = db.collection('votacions');
          votacions.find({targetGroup : { $in: memberships }}).toArray(function (err, docs) {
            if (err) throw err;
            res.json(docs);
          });
          db.close();
        });

      });
    });
  });
/*

})
*/

app.post('/getPollsId', function (req, res) {
  var ret = [224,228,229];
  res.json(ret);
})

app.post('/getPollInfo', function (req, res) {
  var poll = {};
  poll['pollId'] = 254235;
  poll['pollName'] = "Bestie de la biSetmana";
  poll['pollOptions'] = ["Esteve", "Iñigo", "Arnau"];
  poll ['pollDeadline'] = 1487335573;
  poll['isPrivate'] = 0;
  poll['voted'] = "Arnau";
  poll['description'] = "soc una poll random";
  poll['targetGroup'] = "members";
  var ret = poll;
  res.json(poll);
})

app.post('/sendVote', function (req, res) {
  var token = req.body.idtoken;
  var ipollId = req.body.pollId;
  var ioption = req.body.option;
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
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var vote = {};
        vote['userId'] =
        db.collection('votes').update({userId : payload['sub'], pollId : ipollId}, { $set: {option: ioption}}, {upsert: true} );
        db.close();
      })
  })
  var ret = {};
  ret['status'] = 0;
  res.json(ret);
})

function inFunc(targetGroup, targets) {
  for (var i in targets ) if ( i == targetGroup) return true;
  return false;
}

//millor guardar-ho a la db?
function cens(targetGroup) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection('users').count({ $where: function() { return inFunc(targetGroup,this.membership)} }, null,function(err, count) {
      return count;
    });
  })
}

function notifyWithdrawal(){};

app.post('/askWithdrawal', function (req, res) {
  var token = req.body.idtoken;
  var ipollId = req.body.pollId;
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
      MongoClient.connect(url, function(err, db) {
        db.collection('askWithdrawal').insertMany([{userId : payload['sub'], pollId : ipollId}], function () {});
        db.collection('askWithdrawal').count({pollId : ipollId},null,function(err, count) {
          var targetGroup = db.collection('votacions').findOne({pollId : ipollId},{ targetGroup: 1}).targetGroup;
          if (count/cens(targetGroup) > 0.4) notifyWithdrawal();
          db.close();

        });

      })
  })

  var ret = {};
  ret['status'] = 0;
  res.json(ret);
})

app.post('/askPrivate', function (req, res) {
  var token = req.body.idtoken;
  var ipollId = req.body.pollId;
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
        db.collection('askPrivate').insertMany([{userId : payload['sub'], pollId : ipollId}], function () {});
        var howMany = db.collection('askPrivate').count({pollId : ipollId},null,function(err, count) {
          var targetGroup = db.collection('askPrivate').findOne({pollId : ipollId},{ targetGroup: 1}).targetGroup;
          if (count/cens(targetGroup) > 0.2) notifyWithdrawal();
          db.close();

        });
      })
  })

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
    if (err) throw err;
    var users = db.collection('users');
    users.findOne({userId: user_ID}, function(err, ret) {
      if (err) throw err;
      if (ret!= null) res.json(ret.membership);
      else res.json(null);
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
  if (token == "" || token == undefined){
    console.log("Token not defined");
    return 1;
  }
  //console.log(token);
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(e, login) {
      if (e) throw e;
      var payload = login.getPayload();
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var users = db.collection('users');
        users.findOne({userId: payload['sub']}, function(err, ret) {
          if(ret != null){
            var isadmin = false;
            var member_status = ret.membership;
            for(var i = 0; i < member_status.length; ++i){
              isadmin = (["admin"] == member_status[i]);
            }
            if (isadmin){
              var email_to_add = req.body.email;
              var membership_to_add = req.body.newMembership;
              users.findOne({email: email_to_add}, function(err, ret) {
                if(ret!= null){}
                  var found = false;
                  var to_add_status=ret.membership;
                  for(var i = 0; i < to_add_status.length; ++i){
                    found = (to_add_status[i] == membership_to_add);
                  }
                  if (!found){
                    to_add_status.push(membership_to_add);
                    users.updateOne({email: email_to_add}, {$set: {membership: to_add_status}});
                    res.json(0);
                    db.close();
                  }
                  else{
                    res.json(4);
                    db.close();
                  }
                }
                else{
                  res.json(3);
                  db.close();
                }
              });
            }
            else{
              res.json(1);
              db.close();
            }
          }
          else{
            res.json(2)
            db.close();
          }
        });
      });
    });
  })

app.post('/revokeMembership', function (req, res) {
  var token = req.body.idtoken;
  if (token == "" ){
    console.log(token == "" || token == undefined);
    return 1;
  }
  //console.log(token);
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(e, login) {
      if (e) throw e;
      var payload = login.getPayload();
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var users = db.collection('users');
        users.findOne({userId: payload['sub']}, function(err, ret) {
          var isadmin = false;
          var member_status = ret.membership;
          for(var i = 0; i < member_status.length; ++i){
            isadmin = (["admin"] == member_status[i]);
          }
          if (isadmin){
            var email_to_remove = req.body.email;
            var membership_to_remove = req.body.newMembership;
            users.findOne({email: email_to_remove}, function(err, ret) {
              var found = false;
              var to_remove_status=ret.membership;
              var i;
              for(i = 0; (i < to_remove_status.length); ++i){
                found = (to_remove_status[i] == membership_to_remove);
                if (found) break;
              }
              if(found){

                to_remove_status.splice(i, 1);

                users.updateOne({email: email_to_remove}, {$set: {membership: to_remove_status}});
                res.json(0);
                db.close();
              }
              else{
                res.json(2);
                db.close();
              }
            });

          }
          else{
            res.json(1);
            db.close();
          }
        });
      });
    });
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
