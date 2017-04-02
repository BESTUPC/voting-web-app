# BD
## user
**userId** | email | name | membership
 ---| --- | --- | ---
 102462623932080066899 | "petter@best.com"| "Petter Varlac" | ["admin", "full", "all"]

## votacions
**_id** | pollName | pollOptions | targetGroup | isPrivate | pollDeadline | description | state
 --- | --- | --- | --- | --- | --- | ---

3456789 | "Bestie de la biSetmana" | ["uno", "dos", "tres"] | "all" | 0 | 3234672825 | "Si volen possar una descripcio" | "open"

"open"/"close"

## votes
**pollId** | **userId** | pollOption
 --- | --- | ---
3456789 | "petter@best.com" | "dos"

poll option will be a hash with userId, pollId and pollOption + a secret word in case of private poll.

### \* preguntar si l'usuari s'ha de poder saber o no
## askWithdrawal
**pollId** | **userId**
 --- | ---
3456789 | "petter@best.com"

## askPrivate
**pollId** | **userId**
 --- | ---
3456789 | "petter@best.com"
