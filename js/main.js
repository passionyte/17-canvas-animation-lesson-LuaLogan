/**
 * ICS4U - Mr. Brash 🐿️
 * 
 * 17 - Canvas Animation
 * 
 * Author: Logan
 * 
 */
'use strict';
import Player from "./player.js";
import _, { Obstacle, Obstacles, obstacleClasses } from "./obstacles.js";
import Grounds from "./grounds.js";
import { CANVAS, CTX, MS_PER_FRAME, randInt, newImg, cloneArray, SPEED, adtLen, FOCUSED, keyClasses, DEBUG } from "./globals.js";
import { Decorations, Decoration, decorationClasses, maxDecos } from "./deco.js";

// Globals
let SCORE = 0
let BEST = localStorage.getItem("dino_hi") || 0
let SPEEDMOD = 0

const HERO = new Player(120, 150, 88, 94);
const GHANDLER = new Grounds()
const downKeys = {}
const gOver = newImg()

let frame_time = performance.now()
let last_obstacle = frame_time
let last_score = frame_time

// Event Listeners
document.addEventListener("keydown", keypress);
document.addEventListener("keyup", keyup);

// Disable the context menu on the entire document
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  return false;
});

/**
* The user pressed a key on the keyboard
*/
function keypress(event) {
  const key = event.keyCode
  if (downKeys[key]) return

  downKeys[key] = true

  if (keyClasses.jump.includes(key)) {
    HERO.jump()
  }
  else if (keyClasses.duck.includes(key)) { // Start ducking
    HERO.duck(true)
  }
}

/**
 * The user released a key on the keyboard
 */

function keyup(event) {
  const key = event.keyCode
  if (!downKeys[key]) return

  downKeys[key] = null

  if (keyClasses.duck.includes(key)) { // Stop ducking
    HERO.duck(false)
  }
}

// Create decorations
for (let c in decorationClasses) {
  for (let i = 0; (i < maxDecos[c]); i++) {
    let b

    if (c == "cloud") { // The class *is* the bounds
      b = decorationClasses[c]
    }
    else if (c == "star") { // The bounds are state based
      b = decorationClasses[c][1]
    }
    else { // The bounds are random
      b = decorationClasses[c][randInt(1, adtLen(decorationClasses[c]))]
    }

    Decorations.push(new Decoration(c, b, randInt(1150, 2300), randInt(0, 200), (SPEED / 2)))
  }
}

/**
* The main game loop
*/
function update() {
  if (HERO.dead || !FOCUSED) return

  // Prepare for the next frame
  requestAnimationFrame(update)
  /*** Desired FPS Trap ***/
  const NOW = performance.now()
  const TIME_PASSED = NOW - frame_time
  if (TIME_PASSED < MS_PER_FRAME) return
  const EXCESS_TIME = TIME_PASSED % MS_PER_FRAME
  frame_time = NOW - EXCESS_TIME
  /*** END FPS Trap ***/
  // Clear the canvas
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

  // Increment score

  if (NOW - last_score >= 100) {
    SCORE++
    last_score = NOW

    if (SCORE > 200 && (SPEEDMOD < 3)) {
      SPEEDMOD += (1 / 100) // Speed up the game by a certain factor, if speed is under 3 and score is over 200.
    }
  }

  // Draw the ground

  // drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
  for (const ground of GHANDLER.grounds) {
    const w = (2300 / GHANDLER.numGround) // Width of this segment as by numGround

    CTX.drawImage(ground, ground.offset, 102, w, 26, ground.x_pos, 300, w, 28)
    if (ground.x_pos < -w) {
      GHANDLER.moveToBack(ground)
      if (Math.random() < 0.2) {
        ground.offset = randInt(1, w) // Add a random offset to make the ground more interesting
      }
    }
    else {
      ground.x_pos -= (SPEED + SPEEDMOD)
    }
  }

  // Draw decorations

  for (const d of Decorations) {
    if (d.position.x > -100) { // Actually draw but also move our decorations
      d.draw()
      d.position.x -= d.speed
    }
    else {
      d.position.x = randInt(1150, 2300) // Reset positions to a non-concrete value to make them more random
      d.position.y = randInt(0, 200)
    }
  }

  // Create obstacles

  if ((NOW - last_obstacle) >= (2500 / ((1 + SPEEDMOD) + (randInt(-50, 50) / 100)))) { // Has it been a certain amount of time since?
    const type = ((SCORE < 400 || (randInt(1, 6) != 1)) && "cactus") || "bird" // Determine the type of obstacle, if player is 'far' then spawn birds a sixth of the time
    const o = new Obstacle(type, obstacleClasses[type][randInt(1, adtLen(obstacleClasses[type]))], ((type == "bird") && randInt(-30, -150)) || randInt(-6, 6))

    if (o) {
      Obstacles.push(o)
    }
    last_obstacle = NOW
  }

  // Draw obstacles and check collisions for death

  let i = 0
  let curObstacles = cloneArray(Obstacles) // Prevents the flickering
  for (const o of curObstacles) {
    if (o.position.x > -100) {
      o.draw()

      // Only move obstacles and check for death if our pesky hero is still alive
      o.position.x -= (SPEED + SPEEDMOD)

      // Collision checking
      const y = ((HERO.ducking) && 50) || 0
      const b = HERO.bottom
      const t = HERO.top
      const l = HERO.left
      const r = HERO.right
      const w = HERO.size.w
      const h = HERO.size.h

      // Check each corner
      const col = o.check(r, (t + y), w, h) || o.check(l, (b + y), w, h) || o.check(r, (b + y), w, h) || o.check(l, (t + y), w, h)

      // We died, we need to draw game over and set the best.
      if (col) {
        HERO.dead = true
        
        if (SCORE > BEST) {
          BEST = SCORE
          localStorage.setItem("dino_hi", BEST)
    
          SPEEDMOD = 0
        }

        CTX.drawImage(gOver, 1294, 29, 381, 21, (CANVAS.width / (1294 / 381)), 100, 381, 21)
      }
    }
    else { // Remove obstacle, player has avoided it
      Obstacles.splice(i, 1)
    }
    i++
  }

  // Draw our hero
  HERO.update();

  // Draw score

  CTX.textAlign = "left"
  CTX.font = "40px PressStart2P"
  CTX.fillStyle = "white"
  CTX.fillText(SCORE, 0, 50, 200)

  CTX.font = "40px PressStart2P"
  CTX.fillStyle = "white"
  CTX.fillText(BEST, 200, 50, 200)
}

function startGame(ev) {
  if (!ev || (ev.keyCode && keyClasses.jump.includes(ev.keyCode))) {
    document.removeEventListener("keydown", startGame)

    update()
  }
}

function splashScreen() {
  CTX.font = "40px PressStart2P" // Queue somewhat underwhelming splash screen, but hey, gets the job done.
  CTX.fillStyle = "white"
  CTX.textAlign = "center"
  CTX.fillText("Dinosaur Game", (CANVAS.width / 2), ((CANVAS.height / 2) - 50), 400)
  CTX.fillText("Press Space to play", (CANVAS.width / 2), ((CANVAS.height / 2) + 50), 400)

  document.addEventListener("keydown", startGame)
}

// If we're in debug, then start the game, otherwise draw the splash screen above.

if (!DEBUG) {
  splashScreen()
}
else {
  update()
}