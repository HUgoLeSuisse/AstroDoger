import { Player } from "./Player.js";
export class Asteroid {
    posX;
    posY;
    velocityX = 0;
    velocityY = 0;

    static width = 40;
    static height = 40;


    constructor( x, y, velocityX , velocityY ) {
        this.posX = x;
        this.posY = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY
    }

    update(deltaTime) {
        this.posX += this.velocityX * deltaTime;
        this.posY += this.velocityY * deltaTime;
    }

    draw(ctx) {
        ctx.rect(this.posX, this.posY, Asteroid.width, Asteroid.height);
    }
    intersectPlayer(player) {

        let deltaX1 = (this.posX + Asteroid.width) - player.posX;
        let deltaX2 = (player.posX + Player.width) - this.posX;
        let deltaY1 = this.posY - (player.posY + Player.height);
        let deltaY2 = player.posY - (this.posY + Asteroid.height);
        let intersect = (deltaX1 * deltaX2) > 0 && (deltaY1 * deltaY2) > 0;

        return intersect;
    }
    intersect(other) {

        let deltaX1 = (this.posX + Asteroid.width) - other.posX;
        let deltaX2 = (other.posX + other.width) - this.posX;
        let deltaY1 = this.posY - (other.posY + other.height);
        let deltaY2 = other.posY - (this.posY + Asteroid.height);
        let intersect = (deltaX1 * deltaX2) > 0 && (deltaY1 * deltaY2) > 0;

        return intersect;
    }
}