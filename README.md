# Fantasy Celebrity Death Pool
Fantasy Celebrity Death Pool is a betting game where you bet on the death of celebrities.
[Play the game!](https://fantasy-celeb-death-pool.herokuapp.com/)

### How does the game work?
* Pick a list of 15 famous people (people with an English Wikipedia Page) that are currently alive.
* If they die during the year you score points.

The points are calculated like this:
Every famous person gets a starting value of 1000, which gets divided by their age.
The resulting base value is then multiplied by a coefficient based on age brackets:

Age bracket | Coefficient
------------ | -------------
60 or above | 1x
50s | 1.1x
40s | 1.2x
30s | 1.5x
20s | 2x
10s | 3x
9 or below | 5x

### Technologies
Project is created with:
* axios version: 0.21.1
* bcrypt version: 5.0.1
* express version: 4.16.3
* express-session version: 1.17.1
* hbs version: 4.0.1
* passport version: 0.4.1
* passport-local version: 1.0.0