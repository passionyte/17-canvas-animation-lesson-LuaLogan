import { CTX, newImg, FLOOR, DEBUG } from "./globals.js"

export const obstacleClasses = {
    cactus: {
        1: { x: 446, y: 2, w: 102, h: 70 },
        2: { x: 548, y: 2, w: 102, h: 70 },
        3: { x: 652, y: 2, w: 50, h: 100 },
        4: { x: 702, y: 2, w: 48, h: 100 },
        5: { x: 752, y: 2, w: 50, h: 100 },
        6: { x: 802, y: 2, w: 150, h: 100 }
    },
    bird: {
        1: { x: 352, y: 2, w: 92, h: 60 }
    }
}

export const Hitboxes = []
export const Obstacles = []

export default class Hitbox {
    position = {
        x: 0,
        y: 0
    }
    size = {
        w: 0,
        h: 0
    }

    get x() {
        return this.position.x
    }

    get y() {
        return this.position.y
    }

    get w() {
        return this.size.w
    }

    get h() {
        return this.size.h
    }

    check(x, y) {
        if ((x >= this.x && (x <= (this.x + this.w)))) {
            if (y >= this.y && (y <= (this.y + this.h))) {
                return true
            }
        }

        return false
    }

    draw() { // Only for DEBUG mode
        CTX.fillStyle = "aqua"
        CTX.fillRect(this.x, this.y, this.w, this.h)
    }

    constructor(x, y, w, h) {
        this.position.x = x
        this.position.y = y
        this.size.w = w
        this.size.h = h
    }
}

export class Obstacle extends Hitbox {
    #type // Type of obstacle
    img = newImg() // Image

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
        if (DEBUG) super.draw()

        if (this.type == "bird") {
            const NOW = performance.now()

            if (!this.last_flap) {
                this.last_flap = NOW
            }
            else {
                const delta = (NOW - this.last_flap)
                if (delta > 200) {
                    const w = (this.ibounds.w - 1)
                    const h = (this.ibounds.h + 19)
                    CTX.drawImage(this.img, (this.ibounds.x - 92), (this.ibounds.y + 11), w, h, this.position.x, this.position.y, w, h)

                    if (delta > 400) {
                        this.last_flap = NOW
                    }
                    return
                }
            }
        }

        CTX.drawImage(this.img, this.ibounds.x, this.ibounds.y, this.ibounds.w, this.ibounds.h, this.position.x, this.position.y, this.ibounds.w, this.ibounds.h)
    }

    constructor(type, b, yoff) {
        super(2300, ((FLOOR - 40) - ((b.h / 2)) + yoff), b.w, b.h)
        this.ibounds = b
        this.#type = type
    }
}