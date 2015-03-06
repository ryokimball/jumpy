# jumpy

This user must reach the top. 

game:
    jumpy.
moving objects:
    user, falling platforms. 
Controls:
    Move user:
    ←       move left                   (char code 37)
    →       move right                  (char code 39)
    ↓       fall down a level (unsure)  (char code 40)
    space   jump                        (char code 32 ? )
text: 
    game time
position & size: 
    bottom of board is 40 px above bottom of window (window.innerHeight - 40)
    User starts in the middle of the screen and falls to the ground with "natural" gravity (yet decided on mathematical rate)
    Platforms are 1/20th the width of the screen (window.innerWidth / 20)  and fall at a regular speed (non-accelerating, undecided so far) and are deleted when they fall below the ground