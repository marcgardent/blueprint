export class Box {
    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;

    public move(dx:number, dy:number):void {
        this.x +=dx;
        this.y +=dy;
    }
}