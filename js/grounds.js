export default class Grounds {
    grounds = []
    numGround = 2
  
    #newGround() {
      let ground = new Image()
      ground.src = "../images/dino_large.png"
      ground.x_pos = ((2300 / this.numGround) * this.grounds.length)
      ground.offset = Math.random() * 1150
  
      return ground
    }

    get Back() {
        let furthest 
  
        for (const g of this.grounds) {
          if (!furthest || g.x_pos > furthest.x_pos) {
            furthest = g
          }
        }

        return furthest
    }
  
    moveToBack(ground) {
      ground.x_pos = (this.Back.x_pos + (2300 / this.numGround))
    }
  
    constructor() {
      for (let i = 0; (i < this.numGround); i++) {
        this.grounds.push(this.#newGround())
      }
    }
  }