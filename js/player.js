/**
 * player.js
 * 
 * The Player Class
 * 
 * Acts as a sprite or "hero" for the game
 * 
 * Author: 
 */

import { CTX, CANVAS, GRAVITY, FLOOR } from "./globals.js"

export default class Player {
  constructor(x, y, width, height) {
    this.width = width;
    this.height = height;

    this.position = {
      x: x,
      y: y
    }
    this.velocity = {
      x: 0,
      y: 0
    };
  }

  /**
   * Main function to update location, velocity, and image
   */
  update() {
    this.draw();
  }

  /**
   * Draw the player on the canvas
   */
  draw() {
    CTX.fillStyle = "yellow";
    CTX.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
