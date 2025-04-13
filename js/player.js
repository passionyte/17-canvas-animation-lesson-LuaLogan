/**
 * player.js
 * 
 * The Player Class
 * 
 * Acts as a sprite or "hero" for the game
 * 
 * Author: 
 */

import { CTX, CANVAS, GRAVITY, FLOOR, SPEED } from "./globals.js"

export default class Player {
  constructor(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.img = new Image()
    this.steptime = 200
    this.dead = false
    this.step = performance.now()
    this.img.src = "../images/dino_large.png"

    this.position = {
      x: x,
      y: y
    }
    this.velocity = {
      x: 0,
      y: 0
    };
  }

  get right() { return (this.position.x + this.width) }
  get bottom() { return (this.position.y + this.height) }
  get left() { return this.position.x }
  get top() { return this.position.y }
  set right(location) { (this.position.x = (location - this.width)) }
  set bottom(location) { (this.position.y = (location - this.height)) }
  set left(location) { this.position.x = location }
  set top(location) { this.position.y = location }

  /**
   * Main function to update location, velocity, and image
   */
  update() {
    if (!this.dead) {
      // If we hit the floor, stop falling
      if ((this.bottom + this.velocity.y) >= FLOOR) {
        this.velocity.y = 0
        this.bottom = FLOOR
      }
      else {
        this.velocity.y += GRAVITY // Add gravity to the hero
      }

      this.position.x += this.velocity.x // Update the location to the hero
      this.position.y += this.velocity.y
    }

    this.draw();
  }

  /**
   * Draw the player on the canvas
   */
  draw() {
    if (this.dead) {
      CTX.drawImage(this.img, 2030, 2, 88, 94, this.left, (this.bottom - 85), 88, 94)
    }
    else {
      if (this.bottom >= FLOOR) { // On floor. We need to animate steps.
        const delta = (performance.now() - this.step)
  
        if (delta < (this.steptime / 2)) {
          CTX.drawImage(this.img, 1854, 2, 88, 94, this.left, (this.bottom - 85), 88, 94)
        } 
        else {
          if (delta > this.steptime) this.step = performance.now()
          
          CTX.drawImage(this.img, 1942, 2, 88, 94, this.left, (this.bottom - 85), 88, 94)
        }
      }
      else {  
        CTX.drawImage(this.img, 1678, 2, 88, 94, this.left, (this.bottom - 85), 88, 94)
      }
    }
  }

  /**
   * Make the player jump
   */
  jump() {
    if (this.dead) return

    if (this.bottom >= FLOOR) {
      this.bottom = FLOOR
      this.velocity.y = -22
    }
  }
}
