import { CTX, FLOOR } from "./globals.js"

export default class Cactus {
    position = {
        x: 0,
        y: 0
    }

    #type
    img = new Image()

    get type() {
        return this.#type
    }

    draw() {
        const bounds = this.bounds || cacti[this.type]

        if (!this.bounds) this.bounds = bounds
        CTX.drawImage(this.img, bounds.sx, bounds.sy, bounds.sw, bounds.sh, this.position.x, this.position.y, bounds.sw, bounds.sh)
    }

    constructor(x, y, r) {
        this.position.x = x
        this.position.y = y
        this.#type = r

        this.img.src = "../images/dino_large.png"
    }
}

export const cacti = {
    1: {sx: 446, sy: 2, sw: 102, sh: 70},
    2: {sx: 548, sy: 2, sw: 102, sh: 70},
    3: {sx: 652, sy: 2, sw: 50, sh: 100},
}