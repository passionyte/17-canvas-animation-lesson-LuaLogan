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
import { CANVAS, CTX, MS_PER_FRAME, KEYS } from "./globals.js";

// Globals
const HERO = new Player(120, 150, 48, 48);
const numGround = 2

class Grounds {
  grounds = []

  #newGround() {
    let ground = new Image()
    ground.src = "../images/dino_large.png"
    ground.x_pos = ((2300 / numGround) * this.grounds.length)

    return ground
  }

  moveToBack(ground) {
    let furthest 

    for (const g of this.grounds) {
      if (!furthest || g.x_pos > furthest.x_pos) {
        furthest = g
      }
    }

    ground.x_pos = (furthest.x_pos + (2300 / numGround))
  }

  constructor() {
    for (let i = 0; (i < numGround); i++) {
      this.grounds.push(this.#newGround())
    }
  }
}

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
  if (event.keyCode == KEYS.SPACE) {
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
    CTX.drawImage(ground, 0, 102, (2300 / numGround), 26, ground.x_pos, 300, (2300 / numGround), 28)
    if (ground.x_pos < -(2300 / numGround)) {
      GHANDLER.moveToBack(ground)
    }  
    else {
      ground.x_pos -= 10
    }
  }
  // Draw our hero
  HERO.update();
}

// Start the animation
update()
