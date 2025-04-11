import { CTX, FLOOR } from "./globals.js"

const cacti = {
    1: {sx: 446, sy: 2, sw: 102, sh: 70},

}

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
        const bounds = cacti[this.type]
        CTX.drawImage(this.img, bounds.sx, bounds.sy, bounds.sw, bounds.sh, this.position.x, this.position.y, bounds.sw, bounds.sh)
        
    }

    constructor(x, y, r) {
        this.position.x = x
        this.position.y = y
        this.#type = r

        this.img.src = "../images/dino_large.png"
    }
}


