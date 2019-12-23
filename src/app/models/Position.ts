export class Position {
    constructor(public x: number = 0, public y: number = 0) {
    }
    public add(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    public scale(factor) {
        this.x *= factor;
        this.y *= factor;
    }
}
