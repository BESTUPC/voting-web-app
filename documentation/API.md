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
        "numberVotes" : 25,
        #null if private
        "autors" : ["Esteve", "Iñigo", "Arnau"]
     }
]
```

###### /getMembership(userId)
gets the membership of a member
```
#null if userId not found
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
adds a membership to a member
```
    #if successful
    0
    #else
    1
```
###### /revokeMembership(idtoken, email , newMembership)
revoke a membership to a member
```
    0 if successful
    1 if idtoken does not belong to admin
    2 if "newMembership" value not found in email's account
```
