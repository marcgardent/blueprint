import { Position } from './Position';
export class ShadowLinkModel {
    constructor(public inputPos: Position, public outputPos: Position) {
    }
    public get curvePath() {
        return ShadowLinkModel.getCurvePath(this.outputPos.x, this.outputPos.y, this.inputPos.x, this.inputPos.y);
    }
    public static getCurvePath(x1, y1, x2, y2) {
        const smooth = Math.abs(x1 - x2) * 0.5;
        const cx1 = x1 + smooth;
        const cy1 = y1;
        const cx2 = x2 - smooth;
        const cy2 = y2;
        return "M " + x1 + " " + y1 + " C " + cx1 + " " + cy1 + " " + cx2 + " " + cy2 + " " + x2 + " " + y2;
    }
}
