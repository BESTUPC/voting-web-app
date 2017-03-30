var express = require('express')
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var fs = require('fs');
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var obj = JSON.parse(fs.readFileSync('googlecredentials.pswd', 'utf8'));
var CLIENT_ID = obj['id'];
var CLIENT_SECRET = obj['secret'];
var client = new auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "http://localhost:3000/");
var bodyParser = require("body-parser");
var crypto = require('crypto'), algorithm = 'aes-256-ctr', password = CLIENT_SECRET;

function codificate(userId, option, pollId) {
  var cipher = crypto.createCipher(algorithm,password);
  var encrypted = cipher.update(userId + option + pollId, 'utf8', 'hex');
  return encrypted;
}

function decodificate(userId, options, pollId, encrypted) {
  var cipher = crypto.createCipher(algorithm,password);
  for (optionkey in options){
    var auxEncrypted = cipher.update(userId + options[optionkey] + pollId, 'utf8', 'hex');
    if (auxEncrypted == encrypted) return options[optionkey];
  }
  return null;
}
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

/*
//Create the stub, this should be deleted on the final version
MongoClient.connect(url, function(err, db) {
  var user = {};
  user['userId'] = "102462623932080066899";
  user['membership'] = ["admin", "full", "all"];
  user['name'] = "Petter Varlac";
  user['email'] = "petter@best.com";
  db.collection('users').insertMany([user], function(err, result) {});
  var votacio = {};
  votacio['_id'] = new ObjectID("3456789");
  votacio['pollName'] = "Bestie de la biSetmana";
  votacio['pollOptions'] = ["Iñigo", "Quesito", "Bernat", "Laia"];
  votacio['targetGroup'] = "all";
  votacio['isPrivate'] = false;
  votacio['pollDeadline'] = "3234672825";
  votacio['state'] = "open";
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
});*/

//Creating the webserver
var app = express();

//making files in public served at /
app.use(express.static('public'))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//What file to return when acces to '/'
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

//API calls start here
app.post('/getPolls', function (req, res) {
  var token = req.body.idtoken;
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(e, login) {
      if (e) {
        var ret = {}
        ret.status = 2;
        ret.message = e.toString();
        res.json(ret);
        return ret;
      }
      var payload = login.getPayload();
      console.log(payload);
      MongoClient.connect(url, function(err, db) {
        if (err) {
          var ret = {}
          ret.status = 1;
          ret.message = err.toString();
          res.json(ret);
          return ret;
        }
        var users = db.collection('users');
        var user = {};
        user['userId'] = payload['sub'];
        users.findOne({userId: user['userId']},{fields:{membership:1}}, function(err, document) {
          if (err) {
            var ret = {}
            ret.status = 1;
            ret.message = err.toString();
            res.json(ret);
            return ret;
          }
          if(document == null)
          {
            console.log('document not found on DB');
            return 1;
          }
          console.log('document:', document);
          var memberships = document['membership'];
          var votacions = db.collection('votacions');
          votacions.find({targetGroup : { $in: memberships }},{ _id:1, pollName:1,pollDeadline:1, state :1 }).toArray(function (err, docs) {
            if (err) {
              var ret = {}
              ret.status = 1;
              ret.message = err.toString();
              res.json(ret);
              return ret;
            }
                          var ret = {}
            ret.status = 0;
            ret.polls=docs
            res.json(ret);
          });
        });

      });
    });
  });

app.post('/getPollInfo', function (req, res) {
  var token = req.body.idtoken;
  var ipollId = req.body.pollId;
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(err, login) {
      if (err) {
        var ret = {}
        ret.status = 2;
        ret.message = err.toString();
        res.json(ret);
        return ret;
      }
      var payload = login.getPayload();
      console.log(payload);
      MongoClient.connect(url, function(err, db)
        {
          db.collection('votacions').findOne({_id : ObjectID(ipollId)}, function (err, docs)
            {
              if (err) {
                var ret = {}
                ret.status = 1;
                ret.message = err.toString();
                res.json(ret);
                return ret;
              }
              if(docs == null)
              {
                console.log('poll not found in db');
                return 1;
              }
              db.collection('votes').findOne({pollId: ipollId , userId: payload['sub'] }, function(err, ret)
                {

                  if (err) {
                    var ret = {}
                    ret.status = 1;
                    ret.message = err.toString();
                    res.json(ret);
                    return ret;
                  }
                if (ret == null) docs.pollOption = "";
                else docs.pollOption = ret.option;
                docs['status'] = 0;
                res.json(docs);
                db.close();
                });
            });
        });
    });
})

app.post('/sendVote', function (req, res) {
  var token = req.body.idtoken;
  var ipollId = req.body.pollId;
  var ioption = req.body.option;
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(err, login) {
      if (err) {
        var ret = {}
        ret.status = 1;
        ret.message = err.toString();
        res.json(ret);
        return ret;
      }
      var payload = login.getPayload();
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection('votacions').findOne({ _id : new ObjectID(ipollId) }, function (err, doc) {
          if (doc == null){
            console.log(ipollId);
            var ret = {};
            ret.message = "votacio not found in db"
            ret['status'] = 4;
            res.json(ret);
          }
          else if(doc.state == "open"){
            var vote = {};
            vote['userId'] =
            db.collection('votes').update({userId : payload['sub'], pollId : ipollId}, { $set: {option: ioption}}, {upsert: true} );
            db.close();
            var ret = {};
            ret['status'] = 0;
            res.json(ret);
          } else {

            var ret = {};
            ret['status'] = 4;
            ret.message = "Poll Already Closed";
            res.json(ret);

          }
        })
      })
  })
})

function inFunc(targetGroup, targets) {
  for (var i in targets ) if ( i == targetGroup) return true;
  return false;
}

//millor guardar-ho a la db?
function cens(targetGroup) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      var ret = {}
      ret.status = 1;
      ret.message = err.toString();
      res.json(ret);
      return ret;
    }
      db.collection('users').count({ $where: function() { return inFunc(targetGroup,this.membership)} }, null,function(err, count) {
      return count;
    });
  })
}

function notifyWithdrawal(){};

app.post('/askWithdrawal', function (req, res) {
  var token = req.body.idtoken;
  var ipollId = req.body.pollId;
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(err, login) {
      if (err) {
        var ret = {}
        ret.status = 2;
        ret.message = err.toString();
        res.json(ret);
        return ret;
      }
      var payload = login.getPayload();
      MongoClient.connect(url, function(err, db) {
        db.collection('askWithdrawal').insertMany([{userId : payload['sub'], pollId : ipollId}], function () {});
        db.collection('askWithdrawal').count({pollId : ipollId},null,function(err, count) {
          if (err) {
            var ret = {}
            ret.status = 1;
            ret.message = err.toString();
            res.json(ret);
            return ret;
          }
          var targetGroup = db.collection('votacions').findOne({pollId : new ObjectID(ipollId)},{ targetGroup: 1}).targetGroup;
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
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(err, login) {
      if (err) {
        var ret = {}
        ret.status = 2;
        ret.message = err.toString();
        res.json(ret);
        return ret;
      }
      var payload = login.getPayload();
      console.log(payload);
      MongoClient.connect(url, function(err, db) {
        db.collection('askPrivate').insertMany([{userId : payload['sub'], pollId : ipollId}], function () {});
        var howMany = db.collection('askPrivate').count({pollId : ipollId},null,function(err, count) {
          if (err) {
            var ret = {}
            ret.status = 1;
            ret.message = err.toString();
            res.json(ret);
            return ret;
          }
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

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
        // console.log("WIGGLE WIGGLE WIGGLE YEAH!");
    }
    // console.log("EVERYDAY I'M SHUFFLIN'");
}


app.post('/getResults', function (req, res) {
  var ipollId = req.body.pollId;
  var userId1 = req.body.userId;
  MongoClient.connect(url, function(err, db) {
    if (err) {
      var ret = {}
      ret.status = 1;
      ret.message = err.toString();
      res.json(ret);
      return ret;
    }
    else if (db == null){
      var ret = {}
      ret.status = 1;
      ret.message = "DB not found";
      res.json(ret);

    } else {
      var votacions = db.collection('votacions');
      votacions.findOne({_id: ObjectID(ipollId)}, function(err, ret){
        if (err) {
          var ret = {}
          ret.status = 1;
          ret.message = err.toString();
          res.json(ret);
          db.close();
          return ret;
        }
        else if(ret == null){
          res.json(null);
          db.close();

        }
        else{
          var privatePoll = ret.isPrivate;
          var final_poll = {}
          final_poll.name = ret.pollName;
          final_poll.state = ret.state;
          final_poll.pollOptions = ret.pollOptions;
          var vots_count = {}
          var vots_id = {}
          var statepoll = ret.state;
          var votes = db.collection('votes');
          var found = 0;
          var l = final_poll.pollOptions.length;
          var count = 0;
          var adminuser = null;
          // console.log("RETSTATE: ", ret.state);
          // console.log("ADMINUSEROUT: ",adminuser);
          var users = db.collection('users');
          users.findOne({userId: userId1 }, function(err, retuser){
            if(err){
              var ret = {}
              ret.status = 1;
              ret.message = err.toString();
              res.json(ret);
              return ret;
            }
            else if(retuser == null){
              var ret = {}
              ret.status = 1;
              ret.message = "userId not found";
              res.json(ret);
            }
            else{
              // console.log("NAMENAME:  ",retuser.name);
              // console.log(retuser.membership);
              adminuser = retuser.membership.indexOf("admin") > -1;
              // console.log(adminuser);
              // console.log("ADMINUSERIN: ",adminuser);
              if((statepoll == "closed")||((statepoll == "closed_private") && adminuser)){
                final_poll.pollOptions.forEach(function(Option){
                  // console.log("L_OUTFIND = ", l);
                  // console.log("OPTION_POLL_OUTFIND = ", Option);
                  // console.log("COUNT_OUTFIND = ", count);
                  votes.find( {option: Option}, {userId:true,_id: false} ).toArray(function(err, vot_ret) {
                    // console.log("L_OUTFIND = ", l);
                    // console.log("COUNT_INFIND = ", count);
                    if (err){
                      var ret = {}
                      ret.status = 1;
                      ret.message = err.toString();
                      res.json(ret);
                      db.close();
                      return ret;
                    }
                    else if((vot_ret != null) && (vot_ret.length != 0)){
                      // console.log("OPTION_POLL_INFIND_FOUND = ", Option);
                      // console.log(Option);
                      //console.log(vot_ret.length);
                      vots_count[Option] = vot_ret.length;
                      vots_id[Option] = vot_ret;
                      ++count;
                    }
                    else{
                      // console.log("OPTION_POLL_INFIND_NOTFOUND = ", Option);
                      vots_count[Option] = 0;
                      vots_id[Option] = null;
                      ++count;
                    }
                    if(count == l){
                        vots_nom = {};
                        tots_vots = [];
                        var users = db.collection('users');
                        var optionstofind = final_poll.pollOptions.length;
                        // console.log("OPTIONSTOFIND : ", optionstofind);
                        var optionscount = 0;
                        final_poll.pollOptions.forEach(function(Option){
                          // console.log("CACACCACACCACACCA");
                          vots_nom[Option] = [];
                          var namescount = 0;
                          console.log(Option);
                          if(vots_id[Option] != null){
                            var namestofind = vots_id[Option].length;

                          // console.log(namestofind);

                          vots_id[Option].forEach(function(Idtofind){
                            users.findOne({userId: Idtofind.userId}, function(err, namefound){
                              if (err) {
                                var ret = {}
                                ret.status = 1;
                                ret.message = err.toString();
                                res.json(ret);
                                db.close();
                                return ret;
                              }
                              else if(namefound == null){
                                // console.log(Idtofind);
                                var ret = {}
                                ret.status = 1;
                                ret.message = "Voter ID not found in database!";
                                res.json(ret);
                                db.close();
                              }
                              else{
                                // console.log("HERE : ", namefound.name);
                                // console.log("OPTION :", Option);
                                // console.log()
                                vots_nom[Option].push(namefound.name);
                                tots_vots.push(namefound.name);
                                ++namescount;
                                if(namescount == namestofind){
                                  ++optionscount;
                                }
                                if(optionscount == optionstofind){
                                  var ret = {}
                                  ret.status = 0;
                                  final_poll.numberVotes = vots_count;
                                  if(privatePoll){
                                    shuffle(tots_vots);
                                    final_poll.voters = tots_vots;
                                  }
                                  else final_poll.voters = vots_nom;
                                  ret.options = final_poll;
                                  res.json(ret);
                                  db.close();
                                }
                              }
                            });
                          });
                        }
                        else{
                          vots_nom[Option] = null;
                          ++optionscount;
                          if(optionscount == optionstofind){
                            var ret = {}
                            ret.status = 0;
                            final_poll.numberVotes = vots_count;
                            final_poll.voters = vots_nom;
                            ret.options = final_poll;
                            res.json(ret);
                            db.close();
                          }
                        }
                      });
                    }
                  });
                });
              }
              else{
                if(statepoll == "open"){
                  console.log("HI");
                  ret={}
                  ret.status = 1;
                  ret.message = 'Stop trolling, this poll is still open';
                  res.json(null);
                  db.close();
                }
                else{
                  // console.log(adminuser);
                  var ret_final = {}
                  ret_final.status = 3;
                  ret_final.message = 'You have no access to this poll';
                  res.json(ret_final);
                  db.close();
                }
              }
            }
          });
        }
      });
    }
  });
})

app.post('/getUserInfo', function (req, res) {
  var user_ID = req.body.userId;
  MongoClient.connect(url, function(err, db) {
    if (err) {
      var ret = {}
      ret.status = 1;
      ret.message = err.toString();
      res.json(ret);
      return ret;
    }
    var users = db.collection('users');
    users.findOne({userId: user_ID}, function(err, ret) {
      if (err) {
        var ret = {}
        ret.status = 1;
        ret.message = err.toString();
        res.json(ret);
        return ret;
      }
      else if (ret == null){
        res.json(null);
        db.close();
      }
      else{
      var ret_final = {}
      ret_final.status = 0;
      ret_final.membership = ret.membership;
      ret_final.name = ret.name;
      ret_final.email = ret.email;
      res.json(ret_final);
      db.close();
      }
    });
  });
})

app.post('/createPoll', function (req, res) {
  // console.log(JSON.stringify(req.body));
  var token = req.body.idtoken;
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(err, login) {
      if (err) {
        var ret = {}
        ret.status = 2;
        ret.message = err.toString();
        res.json(ret);
        return ret;
      }
      var payload = login.getPayload();
      MongoClient.connect(url, function(err, db) {
        if (err) {
          var ret = {}
          ret.status = 1;
          ret.message = err.toString();
          res.json(ret);
          return ret;
        }
        var users = db.collection('users');
        users.findOne({userId: payload['sub']}, function(err, ret) {
          if (err) {
            var ret = {}
            ret.status = 1;
            ret.message = err.toString();
            res.json(ret);
            return ret;
          }
          if(ret != null){
            var isadmin = false;
            var member_status = ret.membership;
            for(var i = 0; i < member_status.length; ++i){
              if (["admin"] == member_status[i]) isadmin=true;
            }
            if (isadmin){
              var poll = {};
              poll['pollName'] = req.body.pollName;
              poll['pollOptions'] = JSON.parse(req.body.pollOptions);
              poll['targetGroup'] = req.body.targetGroup;
              poll['isPrivate'] = req.body.isPrivate;
              poll['pollDeadline'] = req.body.pollDeadline;
              poll['descrpition'] = req.body.descrpition;
              poll.state = "open";
              db.collection('votacions').insertMany([poll], function () {});
              var ret = {};
              ret.status = 0;
              res.json(ret);
              return ret;
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

app.post('/setState', function (req, res) {
  var token = req.body.idtoken;
  var ipollId = req.body.pollId;
  var newstate = req.body.state;
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(err, login) {
      if (err) {
        var ret = {}
        ret.status = 2;
        ret.message = err.toString();
        res.json(ret);
        return ret;
      }
      var payload = login.getPayload();
      MongoClient.connect(url, function(err, db) {
        if (err) {
          var ret = {}
          ret.status = 1;
          ret.message = err.toString();
          res.json(ret);
          return ret;
        }
        var users = db.collection('users');
        users.findOne({userId: payload['sub']}, function(err, ret) {
          if (err) {
            var ret = {}
            ret.status = 1;
            ret.message = err.toString();
            res.json(ret);
            return ret;
          }
          if(ret != null){
            var isadmin = false;
            var member_status = ret.membership;
            for(var i = 0; i < member_status.length; ++i){
              if (["admin"] == member_status[i]) isadmin=true;
            }
            if (isadmin){
              console.log("NEWSTATE: ", newstate);
              db.collection('votacions').updateOne({_id: new ObjectID(ipollId)}, {$set: {state: newstate}});
              res.json(0);
              db.close();
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


app.post('/updateMembership', function (req, res) {
  var token = req.body.idtoken;
  //console.log(token);
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(err, login) {
      if (err) {
        var ret = {}
        ret.status = 2;
        ret.message = err.toString();
        res.json(ret);
        return ret;
      }
      var payload = login.getPayload();
      MongoClient.connect(url, function(err, db) {
        if (err) {
          var ret = {}
          ret.status = 1;
          ret.message = err.toString();
          res.json(ret);
          return ret;
        }
        var users = db.collection('users');
        users.findOne({userId: payload['sub']}, function(err, ret) {
          if (err) {
            var ret = {}
            ret.status = 1;
            ret.message = err.toString();
            res.json(ret);
            return ret;
          }
          if(ret != null){
            var isadmin = false;
            var member_status = ret.membership;
            for(var i = 0; i < member_status.length; ++i){
              if (["admin"] == member_status[i]) isadmin=true;
            }
            if (isadmin){
              var email_to_add = req.body.email;
              var membership_to_add = JSON.parse(req.body.newMembership);
              users.findOne({email: email_to_add}, function(err, ret)
              {
                if (err){
                  var ret = {}
                  ret.status = 1;
                  ret.message = err.toString();
                  res.json(ret);
                  return ret;
                }
                if(ret!= null){
                    users.updateOne({email: email_to_add}, {$set: {membership: membership_to_add}});
                    var ret = {}
                    ret.status = 0;
                    ret.message = "";
                    res.json(ret);
                    db.close();
                }
                else
                {

                  res.json(null);
                  db.close();
                }
              });
            }
            else{
              var ret = {}
              ret.status = 3;
              ret.message = "Not an admin"
              res.json(ret);
              db.close();
            }
          }
          else{

            res.json(null)
            db.close();
          }
        });
      });
    });
  })

app.post('/revokeMembership', function (req, res) {
  var token = req.body.idtoken;
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(err, login) {
      if (err) {
        var ret = {}
        ret.status = 2;
        ret.message = err.toString();
        res.json(ret);
        db.close();
        return ret;
      }
      var payload = login.getPayload();
      MongoClient.connect(url, function(err, db) {
        if (err) {
          var ret = {}
          ret.status = 1;
          ret.message = err.toString();

          res.json(ret);
          db.close();
          return ret;
        }
        var users = db.collection('users');
        users.findOne({userId: payload['sub']}, function(err, ret) {
          if (err) {
            var ret = {}
            ret.status = 1;
            ret.message = err.toString();

            res.json(ret);
            db.close();
            return ret;
          }
          if(ret == null){

            res.json(null);
            db.close();
          }
          else{
            var isadmin = false;
            var member_status = ret.membership;
            for(var i = 0; i < member_status.length; ++i){
              if (["admin"] == member_status[i]) isadmin=true;
            }
            if (isadmin){
              var email_to_remove = req.body.email;
              var membership_to_remove = req.body.newMembership;
              users.findOne({email: email_to_remove}, function(err, ret) {
                if (err) {
                  var ret = {}
                  ret.status = 1;
                  ret.message = err.toString();

                  res.json(ret);
                  db.close();
                  return ret;
                }
                if(ret == null){

                  res.json(null);
                  db.close();
                }
                else{
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
                    var ret= {}
                    ret.status = 0;
                    res.json(ret);
                    db.close();
                  }
                  else{
                    var ret = {}
                    ret.status = 4;
                    ret.message = "Didn't find newMembership"
                    res.json(ret);
                    db.close();
                  }
                }
              });

            }
            else{
              var ret = {}
              ret.status = 3;
              ret.message = "User not admin"
              res.json(ret);
              db.close();
            }
          }
        });
      });
    });
})

app.post('/tokensignin', function (req, res) {
  var token = req.body.idtoken;
  console.log(token);
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(err, login) {
      if (err) {
        var ret = {}
        ret.status = 2;
        ret.message = err.toString();
        res.json(ret);
        return ret;
      }
      var payload = login.getPayload();
      MongoClient.connect(url, function(err, db) {
        if (err) {
          var ret = {}
          ret.status = 1;
          ret.message = err.toString()  ;
          res.json(ret);
          return ret;
        }
        var users = db.collection('users');
        var user = {};
        user['userId'] = payload['sub'];
        db.collection('users').count(function(err, count) {
          if (count < 3) {
            user['membership'] = ['all','admin'];
          } else {
            user['membership'] = ['all'];
          }
          user['name'] = payload['name'];
          user['email'] = payload['email'];
          users.insertMany([user], function(err, result) {});
          db.close();
          }
        )

      });
    });
})

app.post('/getUsers', function (req, res) {
  var token = req.body.idtoken;
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(err, login) {
      if (err) {
        var ret = {}
        ret.status = 2;
        ret.message = err.toString();
        res.json(ret);
        return ret;
      }
      var payload = login.getPayload();
      MongoClient.connect(url, function(err, db) {
        if (err) {
          var ret = {}
          ret.status = 1;
          ret.message = err.toString();
          res.json(ret);
          return ret;
        }
        var users = db.collection('users');
        users.findOne({userId: payload['sub']}, function(err, ret) {
          if (err) {
            var ret = {}
            ret.status = 1;
            ret.message = err.toString();
            res.json(ret);
            return ret;
          }
          if(ret != null){
            var isadmin = false;
            var member_status = ret.membership;
            for(var i = 0; i < member_status.length; ++i){
              if (["admin"] == member_status[i]) isadmin=true;
            }
            if (isadmin){
              db.collection('users').find({},{_id: 0, name: 1, email: 1, membership : 1 , userId : 1} ).toArray(function (err, docs){
                var aux = {};
                aux.status = 0;
                aux.users = docs;
                res.json(aux);
                db.close();
              })
            }
          }
        })
      })
})
})

//API calls end here

//Definig the port in which will run our app
app.listen(3000, function () {
  console.log('App listening on port 3000!')
})
