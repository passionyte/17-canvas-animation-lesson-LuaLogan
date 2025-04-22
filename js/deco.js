/**
* deco.js
*
* Handles the decorations such as stars, clouds and the moon/sun.
*
* Author: Logan
*
*/

import { CTX, newImg, adtLen } from "./globals.js"

export const Decorations = []

export const decorationClasses = { // Bounds
    cloud: {x: 166, y: 2, w: 92, h: 27},
    star: {
        1: {x: 1274, y: 2, w: 18, h: 18},
        2: {x: 1274, y: 20, w: 18, h: 18},
        3: {x: 1274, y: 38, w: 18, h: 18}
    },
    moon: {
        1: {x: 954, y: 2, w: 40, h: 80},
        2: {x: 994, y: 2, w: 40, h: 80},
        3: {x: 1034, y: 2, w: 40, h: 80},
        4: {x: 1074, y: 2, w: 80, h: 80},
        5: {x: 1154, y: 2, w: 40, h: 80},
        6: {x: 1194, y: 2, w: 40, h: 80},
        7: {x: 1234, y: 2, w: 40, h: 80}
    }
}

export const maxDecos = { // Max decorations able to be displayed on screen
    cloud: 3,
    moon: 1,
    star: 6
}

const decoSpeeds = { // Speeds in which the decorations move at
    cloud: 4,
    moon: 1,
    star: 2
}

export class Decoration {
    #type
    bounds

    position = {
        x: 0,
        y: 0
    }

    img = newImg()

    get type() {
        return this.#type
    }

    draw() {
        if (this.type == "star") { // We need to make our stars twinkle!
            const NOW = performance.now()
            if ((NOW - this.last_twinkle) > 250) {
                const starClass = decorationClasses.star

                if (this.twinkle == adtLen(starClass)) { // Ensures we don't load a non-existing twinkle state
                    this.twinkle = 1
                }
                else {
                    this.twinkle++
                }

                this.last_twinkle = NOW
                this.bounds = starClass[this.twinkle] // Tada! Got the bounds for this twinkle state
            }
        }

        CTX.drawImage(this.img, this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h, this.position.x, this.position.y, this.bounds.w, this.bounds.h)
    }

    constructor(type, b, x, y) {
        this.#type = type

        this.bounds = b
        this.position.x = x
        this.position.y = y
        this.speed = decoSpeeds[type]

        if (type == "star") this.last_twinkle = performance.now(); this.twinkle = 1
    }
}

export default { Decorations }