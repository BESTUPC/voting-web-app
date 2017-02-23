# API

###### /getPolls(idtoken)
given a tokenid return the polls he can vote
```
 [
    {
        "pollId" : 25487,
        "pollName" : "Bestie de la biSetmana",
        "pollOptions" : ["Esteve", "Iñigo", "Arnau"],
        "pollDeadline" : 1487335573, //unix_timestamp in s
        "isPrivate" : 0,
        "targetGroup" : "members",
        "descrpition" : "Qui vols que sigui el proxim Bestie de la biSetmana?",
        "voted" : 0
    }
]
```
###### /getPollsId(idtoken)
given a tokenid return the polls id he can vote
```
[224,228,229]
```

###### /getPollInfo(pollId)
given a poll id return info of the poll
```
{
    "pollId" : 25487,
    "pollName" : "Bestie de la biSetmana",
    "pollOptions" : ["Esteve", "Iñigo", "Arnau"],
    "pollDeadline" : 1487335573,
    "isPrivate" : 0,
    "targetGroup" : "members"
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
 [
     {
        "option" : Juanito,
        "numberVotes" : 25, //millor un vector de tots els nombres, no?
        #null if private
        "autors" : ["Esteve", "Iñigo", "Arnau"]
     }
]
```

###### /getMembership(userId)
gets the membership of a member
```
["admin", "full"]
```

### Only by admin users

###### /createPoll(idtoken, pollName, pollOptions, targetGroup, isPrivate, pollDeadline)
creates a new Poll in the data base
```
{
    "status" : 0,
}
```
###### /addMembership(idtoken, email, newMembership)
add a membership to a member
```
    "successfull" : 0,
    "not an admin" : 1,
    "email not there" : 2
```
###### /revokeMembership(idtoken, email , newMembership)
revoke a membership to a member
```
["full", "member"]
```
