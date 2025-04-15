/**
 * ICS4U - Mr. Brash 🐿️
 * 
 * 17 - Canvas Animation
 * 
 * Author:
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
let BEST = 0
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
  else if (keyClasses.duck.includes(key)) {
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

  if (keyClasses.duck.includes(key)) {
    HERO.duck(false)
  }
}

// Create decorations
for (let c in decorationClasses) {
  for (let i = 0; (i < maxDecos[c]); i++) {
    let b

    if (c == "cloud") { // go figure
      b = decorationClasses[c]
    }
    else if (c == "star") { // state based
      b = decorationClasses[c].idle
    }
    else { // random
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
      SPEEDMOD += 0.02
    }
  }

  // Draw score

  CTX.font = "50px Arial"
  CTX.fillStyle = "white"
  CTX.fillText(SCORE, 100, 50, 50)

  CTX.font = "50px Arial"
  CTX.fillStyle = "white"
  CTX.fillText(BEST, 200, 50, 50)
  // Draw the ground

  // drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
  for (const ground of GHANDLER.grounds) {
    const w = (2300 / GHANDLER.numGround) // Width of this segment as by numGround

    CTX.drawImage(ground, ground.offset, 102, w, 26, ground.x_pos, 300, w, 28)
    if (ground.x_pos < -w) {
      GHANDLER.moveToBack(ground)
      if (Math.random() < 0.2) {
        ground.offset = randInt(1, w)
      }
    }
    else {
      ground.x_pos -= (SPEED + SPEEDMOD)
    }
    i++
  }

  // Draw decorations

  for (const d of Decorations) {
    if (d.position.x > -100) {
      d.draw()
      d.position.x -= d.speed
    }
    else {
      d.position.x = randInt(1150, 2300)
      d.position.y = randInt(0, 200)
    }
  }

  // Create obstacles

  if ((NOW - last_obstacle) >= (2500 / (1 + SPEEDMOD))) {
    const type = ((SCORE < 600 || (randInt(1, 6) != 1)) && "cactus") || "bird"
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

      const y = ((HERO.ducking) && 50) || 0
      const b = HERO.bottom
      const t = HERO.top
      const l = HERO.left
      const r = HERO.right
      const w = HERO.size.w
      const h = HERO.size.h

      const col = o.check(r, (t + y), w, h) || o.check(l, (b + y), w, h) || o.check(r, (b + y), w, h) || o.check(l, (t + y), w, h)

      if (col) {
        HERO.dead = true
        
        if (SCORE > BEST) {
          BEST = SCORE
    
          SPEEDMOD = 0
        }

        CTX.drawImage(gOver, 1294, 29, 381, 21, (CANVAS.width / (1294 / 381)), 100, 381, 21)
      }
    }
    else {
      Obstacles.splice(i, 1)
    }
    i++
  }

  // Draw our hero
  HERO.update();
}

function startGame(ev) {
  if (!ev || (ev.keyCode && keyClasses.jump.includes(ev.keyCode))) {
    document.removeEventListener("keydown", startGame)

    update()
  }
}

function splashScreen() {
  CTX.font = "50px Arial"
  CTX.fillStyle = "white"
  CTX.fillText("Press Space to play", ((CANVAS.width / 2) - 200), (CANVAS.height / 2), 400)

  document.addEventListener("keydown", startGame)
}

// Start the animation

if (!DEBUG) {
  splashScreen()
}
else {
  update()
}