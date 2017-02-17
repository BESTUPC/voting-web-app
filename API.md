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
