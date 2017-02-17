# API
 
###### /getPolls(userId)
given a user id return the polls he can vote
```
 [
    {
        "pollId" : 25487,
        "pollName" : "Bestie de la biSetmana",
        "pollOptions" : ["Esteve", "Iñigo", "Arnau"],
        "pollDeadline" : 1487335573 
    }
]
```
###### /getPollsId(userId)
given a user id return the polls id he can vote
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
    "pollDeadline" : 1487335573 
}

```

###### /sendVote(userId,pollId,option)
sends the vote
```
{
    "status" : 0,
}
```



###### /createPoll(userId,pollName,pollOptions,targetGroup,isPrivate,pollDeadline)
creates a new Poll in the data base
```
{
    "status" : 0,
}
```

###### /askWithdrawal(userId,pollId)
The user is asking for a withdrawal
```
{
    "status" : 0,
}
```

###### /askPrivate(userId,pollId)
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
