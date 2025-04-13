import { CTX, newImg, FLOOR, randInt, adtLen } from "./globals.js"

const bounds = {
    ["cactus"]: {
        1: {x: 446, y: 2, w: 102, h: 70},
        2: {x: 548, y: 2, w: 102, h: 70},
        3: {x: 652, y: 2, w: 50, h: 100},
    },

}

export const Obstacles = []

export default class Obstacle {
    position = {
        x: 0,
        y: 0
    }

    #type // Type of obstacle
    img = newImg() // Image 
    ibounds // Bounds for obstacle

    get type() {
        return this.#type
    }

    get left() {
        return (this.position.x - (this.ibounds.w / 1.5))
    }

    get right() {
        return (this.position.x + (this.ibounds.w / 1.2))
    }

    get top() {
        return this.position.y
    }

    get bottom() {
        return (this.top + this.ibounds.h)
    }

    draw() {
        CTX.drawImage(this.img, this.ibounds.x, this.ibounds.y, this.ibounds.w, this.ibounds.h, this.position.x, this.position.y, this.ibounds.w, this.ibounds.h)
    }

    constructor(type, x = 2300, y = (FLOOR - 70)) {
        this.position.x = x
        this.position.y = y
        this.#type = type

        const b = bounds[this.#type]

        if (b) {
            this.ibounds = b[randInt(1, adtLen(b))]
        }
    }
}