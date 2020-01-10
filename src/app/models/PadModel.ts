import { BlueprintModel } from './BlueprintModel';

export class PadModel {
    public collection = new Array<BlueprintModel>();
    public active: BlueprintModel = undefined;
    public addBlueprint(b: BlueprintModel) {
        this.collection.push(b);
    }
}
