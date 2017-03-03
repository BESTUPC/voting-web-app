# API

###### /getPolls(idtoken)
given a tokenid return the polls he can vote
```
 {
   "status" : 0,
   "polls" :    [
      {
        "status" : 0,
        "pollId" : 25487,
        "pollName" : "Bestie de la biSetmana",
        "pollOptions" : ["Esteve", "Iñigo", "Arnau"],
        "pollDeadline" : 1487335573, //unix_timestamp in s
        "isPrivate" : 0,
        "targetGroup" : "members",
        "descrpition" : "Qui vols que sigui el proxim Bestie de la biSetmana?",
        "option" : "Arnau"
      }
    ]
}
```

###### /getPollInfo(pollId)
given a poll id return info of the poll
```
{
    "status" : 0,
    "pollId" : 25487,
    "pollName" : "Bestie de la biSetmana",
    "pollOptions" : ["Esteve", "Iñigo", "Arnau"],
    "pollDeadline" : 1487335573,
    "isPrivate" : 0,
    "targetGroup" : "members",
    "descrpition" : "Qui vols que sigui el proxim Bestie de la biSetmana?",
    "option": "Arnau"
}

```

###### /sendVote(idtoken, pollId, option)
sends the vote
```
{
    "status" : 0,
}
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
"polls" : [
      {

        "option" : Juanito,
        "numberVotes" : 25,
        #null if private
        "autors" : ["Esteve", "Iñigo", "Arnau"]
      }
     ]
   }
```

###### /getMembership(userId)
gets the membership of a member
```
#null if userId not found
{
  "status" : 0,  
  "membership" : ["admin", "full"]
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
    "status" : 0,  
    "users" : [{"Iñigo","ignigomoreno@gmail.com"},{"Esteve","estevetarra@gmail.com"}]
}
```
###### /getUserMembership(idtoken, email)
gets a user's membership
```
#null if users not found
{
  "status" : 0,  
  "membership" : ["admin", "full"]
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
