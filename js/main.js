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
import Cactus from "./cactus.js";
import Grounds from "./grounds.js";
import { CANVAS, CTX, MS_PER_FRAME, KEYS, FLOOR } from "./globals.js";

// Globals
const HERO = new Player(120, 150, 48, 48);
const Cacti = []

const GHANDLER = new Grounds()

let frame_time = performance.now()

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
  
  // Draw the ground

  // drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
  for (const ground of GHANDLER.grounds) {
    CTX.drawImage(ground, ground.offset, 102, (2300 / GHANDLER.numGround), 26, ground.x_pos, 300, (2300 / GHANDLER.numGround), 28)
    if (ground.x_pos < -(2300 / GHANDLER.numGround)) {
      GHANDLER.moveToBack(ground)
      if (Math.random() < 0.5) {
        ground.offset = Math.random() * (2300 / GHANDLER.numGround)
      }
    }  
    else {
      ground.x_pos -= 5
    }
  }

  // Draw any cacti?

  if (Math.random() < 0.2) Cacti.push(new Cactus(GHANDLER.Back, FLOOR, ))

  // Draw our hero
  HERO.update();
}

// Start the animation
update()
