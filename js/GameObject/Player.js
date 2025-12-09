export class Player {
    posX;
    posY;
    velocityX = 0;
    velocityY = 0;

    static gravity = 3.5;
    static jumpForce = 45;
    static jumpResitance = 1.4;
    static width = 40;
    static height = 50;
    static moveSpeed = 30;

    isGrounded = false;

    constructor( x, y, velocityX = 0, velocityY = 0) {
        this.posX = x;
        this.posY = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY
    }

    update(deltaTime) {

        if (this.velocityY <= 0) {
            this.isGrounded = false;
        this.velocityY += Player.gravity * deltaTime* Player.jumpResitance;
        }
        if (this.velocityY > 0) {
        this.velocityY += Player.gravity * deltaTime;
        }

        this.posX += this.velocityX * deltaTime;
        this.posY += this.velocityY * deltaTime;
    }

    draw(ctx) {
        ctx.rect(this.posX, this.posY, Player.width, Player.height);
    }

    jump() {
        this.velocityY = -Player.jumpForce;
    }

    checkCollision(platforms) {
        for (const element of platforms) {
            let pene = this.intersect(element);
            if (pene != false) {
                if (pene.x != 0) {
                    this.posX += pene.x
                    this.velocityX = 0;
                }
                if (pene.y != 0) {
                    if (pene.y < 0) {
                        this.isGrounded = true;
                    }
                    this.posY += pene.y
                    this.velocityY = 0;
                }
            }
        }
    }

    intersect(other) {

        let deltaX1 = (this.posX + Player.width) - other.posX;
        let deltaX2 = (other.posX + other.width) - this.posX;
        let deltaY1 = this.posY - (other.posY + other.height);
        let deltaY2 = other.posY - (this.posY + Player.height);
        let intersect = (deltaX1 * deltaX2) > 0 && (deltaY1 * deltaY2) > 0;

        // Si ne collsionne pas sortir directe
        if (!intersect)
            return false;

        // Sinon on calcul la penetration
        let deltaX = Math.abs(deltaX1) < Math.abs(deltaX2) ? -deltaX1 : deltaX2;

        let deltaY = Math.abs(deltaY1) < Math.abs(deltaY2) ? -deltaY1 : deltaY2;


        if (Math.abs(deltaX) < Math.abs(deltaY)) {

            return { x: deltaX, y: 0 };
        }
        return {x : 0, y : deltaY};

    }
}