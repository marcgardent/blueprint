import { ShadowLinkModel } from "./ShadowLinkModel";
import { FieldModel } from "./FieldModel";

export class LinkModel {
    public constructor(public readonly input: FieldModel, public readonly output: FieldModel) {
    }
    public get curvePath() {
        return ShadowLinkModel.getCurvePath(this.output.outputX, this.output.outputY, this.input.inputX, this.input.inputY);
    }
}
