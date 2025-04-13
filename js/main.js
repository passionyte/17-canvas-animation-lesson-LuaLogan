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
import Obstacle, { Obstacles } from "./obstacles.js";
import Grounds from "./grounds.js";
import { CANVAS, CTX, MS_PER_FRAME, KEYS, randInt, newImg, cloneArray, SPEED } from "./globals.js";

// Globals
let SCORE = 0
let BEST = 0
let SPEEDMOD = 0

const HERO = new Player(120, 150, 48, 48);

const GHANDLER = new Grounds()

const gOver = newImg()

let frame_time = performance.now()
let last_obstacle = frame_time
let last_score = frame_time

// Event Listeners
document.addEventListener("keydown", keypress);

// Disable the context menu on the entire document
document.addEventListener("contextmenu", (event) => { 
  event.preventDefault();
  return false; 
});

/**
 * The user pressed a key on the keyboard 
 */
function keypress(event) {
  if ([KEYS.W, KEYS.UP_ARROW, KEYS.SPACE].includes(event.keyCode)) {
    HERO.jump()
  }
}

/**
 * The main game loop
 */
function update() {
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

  if (!HERO.dead) {
    if (NOW - last_score >= 100) {
      SCORE++
      last_score = NOW

      if (SPEEDMOD < 2) {
        SPEEDMOD += 0.01
      }
    }
  }
  else {
    if (SCORE > BEST) {
      BEST = SCORE

      SPEEDMOD = 0
    }
  }

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
      if (Math.random() < 0.5) {
        ground.offset = randInt(1, w) 
      }
    }  
    else if (!HERO.dead) {
      ground.x_pos -= (SPEED + SPEEDMOD)
    }
  }

  // Create obstacles

  if (!HERO.dead) {
    if ((NOW - last_obstacle) >= (2000 / (1 + SPEEDMOD))) {
      let o
      if (SCORE < 800 || (randInt(1, 6) != 1)) { 
        // cactus
        o = new Obstacle("cactus") 
      }
      else {
        // caw caw!
        // insert bird here
        console.log("Bird Placeholder")
      }

      if (o) {
        Obstacles.push(o)
      }
      
      last_obstacle = NOW
    }
  }

  // Draw obstacles and check collisions for death

  let i = 0
  let curObstacles = cloneArray(Obstacles) // Prevents the flickering
  for (const o of curObstacles) {
    if (o.position.x > - 100) {
      o.draw()

      if (!HERO.dead) { // Only move obstacles and check for death if our pesky hero is still alive
        o.position.x -= (SPEED + SPEEDMOD)
        if (HERO.left < o.right && (HERO.left > o.left)) {
          if (HERO.top > (o.top - 50) && (HERO.top < o.bottom)) {
            HERO.dead = true
          }
        }
      }
    }
    else {
      Obstacles.splice(i, 1)
    }
    i++
  }
  
  // Draw our hero
  HERO.update();

  if (HERO.dead) {
    CTX.drawImage(gOver, 1294, 29, 381, 21, (CANVAS.width / (1294 / 381)), 100, 381, 21)
  }
}

// Start the animation
update()