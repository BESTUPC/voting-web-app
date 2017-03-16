# API

###### /getPolls(idtoken)
given a tokenid return the polls he can vote
```
{
  "status": 0,
  "polls": [
    {
      "_id": "3456789",
      "pollName": "Bestie de la biSetmana",
        "pollDeadline": "3234672825",
      "state" : "open"
    }
  ]
}
```

###### /getPollInfo(pollId,idtoken)
given a poll id return info of the poll
```
{
  "_id": "3456789",
  "pollName": "Bestie de la biSetmana",
  "pollOptions": [
    "Iñigo",
    "Quesito",
    "Bernat",
    "Laia"
  ],
  "targetGroup": "all",
  "isPrivate": false,
  "pollDeadline": "3234672825",
  "description": "descripció ... why?",
  "pollOption": "Iñigo",
  "status": 0
}
```

###### /sendVote(idtoken, pollId, option)
sends the vote
```
{
    "status" : 0,
}
```

###### /egetResults(pollId)
```
[
  {
    "_id": "Bernat",
    "total": 1
  },
  {
    "_id": "Iñigo",
    "total": 1
  }
]
```

###### /askWithdrawal(idtoken, pollId)
The user is asking for a withdrawal
```
{
    "status" : 0,
}
```

###### /askPrivate(idtoken, pollId)
The user is asking for the poll to be private
```
{
    "status" : 0,
}
```

###### /getResults(pollId)
Given a poll id return the results if it's closed
```
#null if pollId not found
{
"status" : 0,
"options" : [
      {
        "pollOptions" = ["Juanito, "Pepito", "Pastanaga"]
        "numberVotes" : [3,2,1]
        #null if private
        "voters" : [
            ["Bernat", "Maitane", "Jordi"] ,
            ["Canya", "Marta"],
            ["Quesito"]
          ]
      }
     ]
}
```

###### /getUserInfos(userId)
gets the membership, name and email of a member
```
#null if userId not found
{
  "status" : 0,  
  "membership" : ["admin", "full"]
  "name" : "Pepe"
  "email" : "pepe@gmail.com"
}
```

### Only by admin users

###### /createPoll(idtoken, pollName, pollOptions, targetGroup, isPrivate, pollDeadline)
creates a new Poll in the data base
```
{
    "status" : 0,
}
```
###### /getUsers(idtoken)
gets a list of all users in the db
```
{
  "status": 0,
  "users": [
    {
      "userId": "102462623832080066896",
      "membership": [
        "all",
        "admin"
      ],
      "name": "Esteve Tarragó",
      "email": "estevetarra@gmail.com"
    },
    {
      "userId": "102462623932080066899",
      "membership": [
        "admin",
        "full",
        "all"
      ],
      "name": "Petter Varlac",
      "email": "petter@best.com"
    }
  ]
}
```
###### /addMembership(idtoken, email, newMembership)
adds a membership to a member
```
#null if users not found
{
    "status" : 0
}
```
###### /revokeMembership(idtoken, email , newMembership)
revoke a membership to a member
```
#null if users not found
{
    "status" : 0
}

```


## Errors
```
{
    "status" : 1,
    "message" : "I have an error"
}
```

status code | meaning
--- | ---
0 | everything is alright, don't worry
1 | problems with the DB
2 | problems with google API
3 | user not allowed
4 | other shit
