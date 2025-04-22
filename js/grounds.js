/**
* grounds.js
*
* Handles the scrolling ground
*
* Author: Logan
*
*/

import { newImg } from "./globals.js"

export default class Grounds {
    grounds = []
    numGround = 2 // Looks pretty bad with higher numbers so keeping it at 2 is simple
  
    #newGround() { // New ground segment
      let ground = newImg()
      ground.x_pos = ((2300 / this.numGround) * this.grounds.length)
      ground.offset = Math.random() * 1150
  
      return ground
    }

    moveToBack(ground) { // Moves to the back of the screen like a sliding window effect
      let furthest 
  
      for (const g of this.grounds) {
        if (!furthest || g.x_pos > furthest.x_pos) {
          furthest = g
        }
      }

      ground.x_pos = (furthest.x_pos + (2300 / this.numGround))
    }
  
    constructor() {
      for (let i = 0; (i < this.numGround); i++) {
        this.grounds.push(this.#newGround())
      }
    }
  }