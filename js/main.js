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
import Cactus, { cacti, CactiStore } from "./cactus.js";
import Grounds from "./grounds.js";
import { CANVAS, CTX, MS_PER_FRAME, KEYS, FLOOR, randInt, adtLen, newImg } from "./globals.js";

// Globals
let score = 0
let best = 0

const HERO = new Player(120, 150, 48, 48);
export const Cacti = []

const GHANDLER = new Grounds()

const gOver = newImg()

let frame_time = performance.now()
let lastcacti = frame_time
let lastscore = frame_time

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
    if (NOW - lastscore >= 100) {
      score++
      lastscore = NOW

      GHANDLER.speed += 0.01
    }
  }
  else {
    if (score > best) {
      best = score

      GHANDLER.speed = 10
    }
  }

  CTX.font = "50px Arial"
  CTX.fillStyle = "white"
  CTX.fillText(score, 100, 50, 50)

  CTX.font = "50px Arial"
  CTX.fillStyle = "white"
  CTX.fillText(best, 200, 50, 50)
  
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
      ground.x_pos -= GHANDLER.speed
    }
  }

  // Draw any cacti?

  console.log(`ground time ${(1000 + (1000 / (GHANDLER.speed / 10)))}`)
  if (!HERO.dead && (Math.random() < 0.01 && ((NOW - lastcacti) > (1000 + (1000 / (GHANDLER.speed / 10)))))) {
      const type = randInt(1, adtLen(cacti))
      const cactus = new Cactus(2300, (FLOOR - cacti[type].sh), type)

      CactiStore.push(cactus)
      lastcacti = NOW
  }

  for (const c of CactiStore) {
    if (c.position.x > -100) {
      c.draw()
      CTX.fillStyle = "aqua"
      CTX.fillRect(c.left, 100, 10, 10)
      CTX.fillRect(c.right, 100, 10, 10)
      if (!HERO.dead) c.position.x -= GHANDLER.speed
    }
    else {
      CactiStore.filter(((el) => (el == c)))
    }
  }

  // Draw our hero
  HERO.update();

  if (HERO.dead) {
    CTX.drawImage(gOver, 1294, 29, 381, 21, (CANVAS.width / (1294 / 381)), 100, 381, 21)
  }
}

// Start the animation
update()