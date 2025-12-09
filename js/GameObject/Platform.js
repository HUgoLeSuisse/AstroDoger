export class Platform {
    posX;
    posY;
    width;
    height;
    constructor(x,y,w,h) {
        this.posX = x;
        this.posY = y;
        this.width = w;
        this.height = h;
    }

    draw(ctx) {
        ctx.rect(this.posX, this.posY, this.width, this.height);
    }
}