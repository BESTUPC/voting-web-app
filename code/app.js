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
var client = new auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "https://localhost:3000/");
var bodyParser = require("body-parser");
var crypto = require('crypto'), algorithm = 'aes-256-ctr', password = CLIENT_SECRET;
var https = require("https");
//var credentials = {key: privateKey, cert: certificate};

const http = require('http');
/*
const https = require('https');

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/bestbarcelona.org/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/bestbarcelona.org/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/bestbarcelona.org/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};
*/
//Connection to mongodb
// Connection URL
//var url = 'mongodb://bestbarcelona.org:27017/votacions';
var url = 'mongodb://localhost:27017/votacions';

// Use connect method to connect to the server and creates unique indexes
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  try {
    db.collection('users').createIndex( { "userId" : 1}, { unique: true} );
    db.collection('votes').createIndex( {"pollId" : 1, "userId" : 1}, { unique: true});
    db.collection('askWithdrawal').createIndex( {"pollId" : 1, "userId" : 1}, { unique: true});
    db.collection('askPrivate').createIndex( {"pollId" : 1, "userId" : 1}, { unique: true});
    console.log("Connected successfully to server");
    db.close();
  } catch (error) {
    console.log("Could't create index");
  }
});

//Creating the webserver
var app = express();
//var httpsServer=https.createServer(app);
var httpsServer=app;

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

//What file to return when acces to '/' Pendent de borrar, creiem que no fa res


//API calls start here
app.post('/getPolls', function (req, res) {
  console.log("getPolls: " +  JSON.stringify(req.body));
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
          db.close();
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
            db.close();
            return ret;
          }
          if(document == null)
          {
              var ret = {}
              ret.status = 1;
              ret.message = "User with id " + user['userId'] + 'not in the DB' ;
              res.json(ret);
              db.close()
              return ret;
          }
          var memberships = document['membership'];
          var votacions = db.collection('votacions');
          votacions.find({targetGroup : { $in: memberships }},{ _id:1, pollName:1,pollDeadline:1, state :1 }).toArray(function (err, docs) {
            if (err) {
              var ret = {}
              ret.status = 1;
              ret.message = err.toString();
              res.json(ret);
              db.close();
              return ret;
            }
            var ret = {}
            ret.status = 0;
            ret.polls=docs;
            res.json(ret);
            db.close();
            return ret;
          });
        });

      });
    });
  });

app.post('/getPollInfo', function (req, res) {
  console.log('getPollInfo: ' +JSON.stringify(req.body));
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
      //console.log(payload);
      MongoClient.connect(url, function(err, db)
        {
          db.collection('votacions').findOne({_id : ObjectID(ipollId)}, function (err, docs)
            {
              if (err) {
                var ret = {}
                ret.status = 1;
                ret.message = err.toString();
                res.json(ret);
                db.close();
                return ret;
              }
              if(docs == null)
              {
                var ret = {}
                ret.status = 1;
                ret.message = 'poll not found in db';
                res.json(ret);
                db.close();
                return ret;
              }
              db.collection('votes').findOne({pollId: ipollId , userId: payload['sub'] }, function(err, ret)
                {

                  if (err) {
                    var ret = {}
                    ret.status = 1;
                    ret.message = err.toString();
                    res.json(ret);
                    db.close();
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
  console.log('sendVote: ' +JSON.stringify(req.body));
  var token = req.body.idtoken;
  var ipollId = req.body.pollId;
  var ioption = req.body.option;
  var idelegation = req.body.delegation == "true";
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
        if (err) {
          var ret = {}
          ret.status = 1;
          ret.message = err.toString();
          res.json(ret);
          db.close();
          return ret;
        }
        db.collection('users').findOne({userId: payload['sub']}, function(err, ret) {
          if (err) {
            var ret = {}
            ret.status = 1;
            ret.message = err.toString();
            res.json(ret);
            db.close();
            return ret;
          }
          if (req == null) {
            var ret = {}
            ret.status = 1;
            ret.message = "user id not found";
            res.json(ret);
            db.close();
            return ret;
          }
          var isadmin = false;
          var memberships = ret.membership
          for (var mem in memberships){
            if (memberships[mem] == "admin"){
              isadmin = true;
            }
          }
          if (!isadmin && idelegation){
            var ret = {}
            ret.status = 1;
            ret.message = "Non admins cannot delegate";
            res.json(ret);
            db.close();
            return ret;
          }
          db.collection('votacions').findOne({ _id : new ObjectID(ipollId) }, function (err, doc) {
            if (doc == null){
              console.log(ipollId);
              var ret = {};
              ret.message = "votacio not found in db"
              ret['status'] = 4;
              res.json(ret);
              db.close();
              return ret;
            }
            if(doc.state == "open"){
              if (idelegation){
                db.collection('votes').find({userId: /^delegation_/ , pollId: ipollId}).toArray(function(err, result){
                  if (err) {
                    var ret = {}
                    ret.status = 1;
                    ret.message = err.toString();
                    res.json(ret);
                    db.close();
                    return ret;
                  }
                  var max = 0;
                  result.forEach(x=>max=Math.max(max,parseInt(x.userId.substr(11))))
                  var vote = {};
                  vote['userId'] =
                  db.collection('votes').update({userId : 'delegation_'+(max+1), pollId : ipollId}, { $set: {option: ioption}}, {upsert: true} );
                  var ret = {};
                  ret['status'] = 0;
                  res.json(ret);
                  db.close();
                  return ret;
                })
              }
              else{
                var vote = {};
                vote['userId'] =
                db.collection('votes').update({userId : payload['sub'], pollId : ipollId}, { $set: {option: ioption}}, {upsert: true} );
                var ret = {};
                ret['status'] = 0;
                res.json(ret);
                db.close();
                return ret;
              }
            } else {
              var ret = {};
              ret['status'] = 4;
              ret.message = "Poll Already Closed";
              res.json(ret);
              db.close();
              return ret;
            }
          })
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
      db.close();
      return ret;
    }
      db.collection('users').count({ $where: function() { return inFunc(targetGroup,this.membership)} }, null,function(err, count) {
      return count;
      db.close();
    });
  })
}

function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
        // console.log("WIGGLE WIGGLE WIGGLE YEAH!");
    }
    // console.log("EVERYDAY I'M SHUFFLIN'");
}

app.post('/removeDelegations', function (req,res){  
  console.log('removeDelegations: ' +JSON.stringify(req.body));
  var token = req.body.idtoken;
  var ipollId = req.body.pollId;
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
        if (err) {
          var ret = {}
          ret.status = 1;
          ret.message = err.toString();
          res.json(ret);
          db.close();
          return ret;
        }
        db.collection('users').findOne({userId: payload['sub']}, function(err, ret) {
          if (err) {
            var ret = {}
            ret.status = 1;
            ret.message = err.toString();
            res.json(ret);
            db.close();
            return ret;
          }
          if (req == null) {
            var ret = {}
            ret.status = 1;
            ret.message = "user id not found";
            res.json(ret);
            db.close();
            return ret;
          }
          var isadmin = false;
          var memberships = ret.membership
          for (var mem in memberships){
            if (memberships[mem] == "admin"){
              isadmin = true;
            }
          }
          if (!isadmin && idelegation){
            var ret = {}
            ret.status = 1;
            ret.message = "Non admins cannot change delegations";
            res.json(ret);
            db.close();
            return ret;
          }
          db.collection('votacions').findOne({ _id : new ObjectID(ipollId) }, function (err, doc) {
            if (doc == null){
              console.log(ipollId);
              var ret = {};
              ret.message = "votacio not found in db"
              ret['status'] = 4;
              res.json(ret);
              db.close();
              return ret;
            }
            if(doc.state == "open"){
              db.collection('votes').deleteMany({userId: /^delegation_/ , pollId: ipollId}, function(err, result){
                if (err) {
                  var ret = {}
                  ret.status = 1;
                  ret.message = err.toString();
                  res.json(ret);
                  db.close();
                  return ret;
                }
                var ret = {};
                ret['status'] = 0;
                res.json(ret);
                db.close();
                return ret;
              })
              
            } else {
              var ret = {};
              ret['status'] = 4;
              ret.message = "Poll Already Closed";
              res.json(ret);
              db.close();
              return ret;
            }
          })
        })
      })
  })
})

app.post('/egetResults', function (req, res) {
  console.log('egetResults: ' + JSON.stringify(req.body));
  var ipollId = req.body.pollId;
  //var userId1 = req.body.userId;
  MongoClient.connect(url, function(err, db) {
    if (err) {
      var ret = {}
      ret.status = 1;
      ret.message = err.toString();
      res.json(ret);
      db.close();
      return ret;
    }
    db.collection('votacions').findOne({_id: ObjectID(ipollId)}, function(err, doc){
      console.log(ret);
      if (err) {
        var ret = {}
        ret.status = 1;
        ret.message = err.toString();
        res.json(ret);
        db.close();
        return ret;
      }
      if(doc == null){
        var ret = {}
        ret.status = 1;
        ret.message = 'poll not found';
        res.json(ret);
        db.close();
        return ret;
      }
      if (doc.state == "open"){
        var ret = {}
        ret.status = 1;
        ret.message = 'poll open';
        res.json(ret);
        db.close();
        return ret;
      }
      if (doc.state == "closed_private"){
        var users = db.collection('users');
        users.findOne({userId: req.body.userId}, function(err, ret) {
          if (err) {
            var ret = {}
            ret.status = 1;
            ret.message = err.toString();
            res.json(ret);
            db.close();
            return ret;
          }
          if (req == null) {
            var ret = {}
            ret.status = 1;
            ret.message = "user id not found";
            res.json(ret);
            db.close();
            return ret;
          }
          var isadmin = false;
          var memberships = ret.membership
          for (var mem in memberships){
            if (memberships[mem] == "admin"){
              isadmin = true;
            }
          }
          if (isadmin == false){
            var ret = {}
            ret.status = 3;
            ret.message = "This poll is closed but the results are only available for admins";
            res.json(ret);
            return ret;
          }
          get_results(doc,ipollId,db,(ret)=>{       
            db.close();
            res.json(ret);
            return ret;
          })
        })
      } 
      else{
        
        get_results(doc,ipollId,db,(ret)=>{       
          db.close();
          res.json(ret);
          return ret;
        })

      }
    });
  });
});

function get_results(doc,ipollId,db,fun){
  var isPrivate = doc.isPrivate == "true";
  var isPriority = doc.isPriority == "true";
  var options = doc.pollOptions;
  var name = doc.pollName;
  var state = doc.state;
  db.collection('votes').aggregate(
    [
    { $match : { pollId: ipollId }
    },
    { $lookup:
        {
          from: "users",
          localField: "userId",
          foreignField: "userId",
          as: "userInfo"
        }
    }
  ],
    function(err, result){
      if (err) {
        var ret = {}
        ret.status = 1;
        ret.message = err.toString();
        res.json(ret);
        db.close();
        return ret;
      }
      if (isPriority){
        ret=[]
        while(options.filter(x=>x!="Blanc" && x!="Abstenció").length>1){
          var voters = {};
          for (var keyOption in options){
            voters[options[keyOption]] = [];
          }
          for (var docKey in result){
            var doc = result[docKey];
            option=JSON.parse(doc.option);
            selected=option.find(x=>options.indexOf(x)>=0);

            if (result[docKey].userId.startsWith("delegation_")){
              voters[selected].push(result[docKey].userId);
            }
            else{
              voters[selected].push(doc.userInfo[0].name);
            }
          }

          keys=options.filter(x=>x!="Blanc" && x!="Abstenció")
          var lowest = Math.min.apply(null, keys.map(function(x) { return voters[x].length} ));
          var match  = keys.filter(function(y) { return voters[y].length === lowest });
          reti=get_ret_from_voters(voters,isPrivate,isPriority,name,state)

          if (match.length>1){
            options=[]
            reti.eliminated_option="Multiple options are lowest, do not know what to eliminate"
          }
          else{
            options=options.filter(x=>x!=match[0])
            reti.eliminated_option=match[0];
          }

          ret.push(reti)
        }
        fun(ret);
        return ret;
      }
      else{
        var voters = {};
        for (var keyOption in options){
          voters[options[keyOption]] = [];
        }
        for (var docKey in result){
          var doc = result[docKey];
          if (result[docKey].userId.startsWith("delegation_")){
            voters[doc.option].push(result[docKey].userId);
          }
          else{
            voters[doc.option].push(doc.userInfo[0].name);
          }
        }
        ret=get_ret_from_voters(voters,isPrivate,isPriority,name,state)
      }
      fun(ret);
      return ret;

  });
  
}

function get_ret_from_voters(voters,isPrivate,isPriority,name,state){
  var ret = {};
  ret.isPrivate = isPrivate;
  ret.name = name;
  ret.state = state;
  ret.status = 0;
  ret.result = {};
  for (var option in voters){
    ret.result[option]= voters[option].length;
  }
  if (isPrivate){
    ret.voters = [];
    for (var option in voters){
      for (var key in voters[option])
       ret.voters.push(voters[option][key]);
    }
  }
  else {
    ret.voters = voters;
  }
  return ret;
}

app.post('/getResults', function (req, res) {
  console.log('getResults: ' + JSON.stringify(req.body));
  var ipollId = req.body.pollId;
  var userId1 = req.body.userId;
  MongoClient.connect(url, function(err, db) {
    if (err) {
      var ret = {}
      ret.status = 1;
      ret.message = err.toString();
      res.json(ret);
      db.close();
      return ret;
    }
    else if (db == null){
      var ret = {}
      ret.status = 1;
      ret.message = "DB not found";
      res.json(ret);
      db.close();
      return ret;
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
          var ret = {}
          ret.status = 1;
          ret.message = 'poll not found';
          res.json(ret);
          db.close();
          return ret;
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
              db.close();
              return ret;
            }
            else if(retuser == null){
              var ret = {}
              ret.status = 1;
              ret.message = "userId not found";
              res.json(ret);
              db.close();
              return ret;
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
                  votes.find( {option: Option, pollId: ipollId}, {userId:true,_id: false} ).toArray(function(err, vot_ret) {
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
                          //console.log(Option);
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
                                return ret;
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
                                  return ret;
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
                            return ret;
                          }
                        }
                      });
                    }
                  });
                });
              }
              else{
                if(statepoll == "open"){
                  //console.log("HI");
                  ret={}
                  ret.status = 1;
                  ret.message = 'Stop trolling, this poll is still open';
                  res.json(null);
                  db.close();
                  return ret;
                }
                else{
                  // console.log(adminuser);
                  var ret_final = {}
                  ret_final.status = 3;
                  ret_final.message = 'You have no access to this poll';
                  res.json(ret_final);
                  db.close();
                  return ret;
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
  console.log('getUserInfo : ' + JSON.stringify(req.body));
  var user_ID = req.body.userId;
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
    users.findOne({userId: user_ID}, function(err, ret) {
      if (err) {
        var ret = {}
        ret.status = 1;
        ret.message = err.toString();
        res.json(ret);
        db.close();
        return ret;
      }
      else if (ret == null){
        var ret = {}
        ret.status = 1;
        ret.message = 'User not found in getUserInfo with id ' + user_ID;
        res.json(ret);
        db.close();
        return ret;
      }
      else{
        var ret_final = {}
        ret_final.status = 0;
        ret_final.membership = ret.membership;
        ret_final.name = ret.name;
        ret_final.email = ret.email;
        res.json(ret_final);
        db.close();
        return ret_final;
      }
    });
  });
})

app.post('/createPoll', function (req, res) {
  console.log('createPoll : ' +JSON.stringify(req.body));
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
              poll['isPriority'] = req.body.isPriority
              poll['pollDeadline'] = req.body.pollDeadline;
              poll['descrpition'] = req.body.descrpition;
              poll.state = "open";
              db.collection('votacions').insertMany([poll], function () {});
              var ret = {};
              ret.status = 0;
              res.json(ret);
              db.close();
              return ret;
            }
            else{
              var ret = {}
              ret.status = 1;
              ret.message = 'poll Not found';
              res.json(ret);
              db.close();
              return ret;
            }
          }
          else{
            var ret = {}
            ret.status = 2;
            ret.message = 'poll Not found';
            res.json(ret);
            db.close();
            return ret;
          }
        });
      });
    });
})

app.post('/setState', function (req, res) {
  console.log('setState : ' + JSON.stringify(req.body));
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
          if(ret != null){
            var isadmin = false;
            var member_status = ret.membership;
            for(var i = 0; i < member_status.length; ++i){
              if (["admin"] == member_status[i]) isadmin=true;
            }
            if (isadmin){
              //console.log("NEWSTATE: ", newstate);
              db.collection('votacions').updateOne({_id: new ObjectID(ipollId)}, {$set: {state: newstate}});
              var ret = {}
              ret.status = 0;
              res.json(ret);
              db.close();
              return ret;
            }
            else{
              var ret = {}
              ret.status = 1;
              res.json(ret);
              db.close();
              return ret;
            }
          }
          else{
            var ret = {}
            ret.status = 2;
            res.json(ret);
            db.close();
            return ret;
          }
        });
      });
    });
})

app.post('/updateMembership', function (req, res) {
  console.log('updateMembership : ' + JSON.stringify(req.body));
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
                  db.close();
                  return ret;
                }
                if(ret!= null){
                    users.updateOne({email: email_to_add}, {$set: {membership: membership_to_add}});
                    var ret = {}
                    ret.status = 0;
                    ret.message = "";
                    res.json(ret);
                    db.close();
                    return ret;
                }
                else
                {
                  var ret = {}
                  ret.status = 1;
                  ret.message = "urser not found";
                  res.json(ret);
                  db.close();
                  return ret;
                }
              });
            }
            else{
              var ret = {}
              ret.status = 3;
              ret.message = "Not an admin";
              res.json(ret);
              db.close();
            }
          }
          else{
            var ret = {}
            ret.status = 4;
            ret.message = "User not found";
            res.json(ret);
            db.close();
          }
        });
      });
    });
  })

app.post('/revokeMembership', function (req, res) {
  console.log('revokeMembership : ' + JSON.stringify(req.body));
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
            var ret = {}
            ret.status = 1;
            ret.message = 'user not found in db';
            res.json(ret);
            db.close();
            return ret;
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
                  var ret = {}
                  ret.status = 1;
                  ret.message ='email not found';
                  res.json(ret);
                  db.close();
                  return ret;
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
                    return ret;
                  }
                  else
                  {
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
  console.log('tokensignin : ' + JSON.stringify(req.body));
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
          ret.message = err.toString()  ;
          res.json(ret);
          db.close();
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
          var ret = {}
          ret.status = 0;
          ret.message = 'Error on signin'  ;
          res.json(ret);
          db.close();
          return ret;
          }
        )

      });
    });
})

app.post('/getUsers', function (req, res) {
  console.log('getUsers : ' + JSON.stringify(req.body));
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
                return aux;
              })
            } else {
              var aux = {};
              aux.status = 1;
              aux.message = 'user not admin';
              res.json(aux);
              db.close();
              return aux;
            }
          } else {
            var aux = {};
            aux.status = 1;
            aux.message = 'user not found';
            res.json(aux);
            db.close();
            return aux;
          }
        })
      })
})
})

app.post('/removePoll', function (req, res) {
  console.log('removePoll : ' + JSON.stringify(req.body));
  var token = req.body.idtoken;
  var pollId = req.body.pollId;
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
            var ret = {}
            ret.status = 1;
            ret.message = 'user not found in db';
            res.json(ret);
            db.close();
            return ret;
          }
          else{
            var isadmin = false;
            var member_status = ret.membership;
            for(var i = 0; i < member_status.length; ++i){
              if (["admin"] == member_status[i]) isadmin=true;
            }
            if (isadmin){
              db.collection('votacions').deleteOne( { _id: ObjectID(pollId)}, { justOne: true }, function(error, result) {
                console.log("error" + error);
                console.log("result" + result);
                var ret = {}
                ret.status = 0;
                ret.message = "Poll deleted successfully";
                res.json(ret);
                db.close();
                  return ret;
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


//API calls end here


//Definig the port in which will run our app
const httpServer = http.createServer(app);
//const httpsServer = https.createServer(credentials, app);

httpServer.listen(3000, () => {
	console.log('HTTP Server running on port 3000');
});
/*
httpsServer.listen(3000, () => {
	console.log('HTTPS Server running on port 3000');
});
*/