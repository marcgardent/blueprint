export class Position {
    constructor(public x: number = 0, public y: number = 0) {
    }
    public add(dx:number, dy:number) {
        this.x += dx;
        this.y += dy;
    }
    public scale(factor:number) {
        this.x *= factor;
        this.y *= factor;
    }
}
