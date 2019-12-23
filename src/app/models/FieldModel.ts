import { NodeModel } from './NodeModel';
import { LinkModel } from './LinkModel';

export const SIZE_BLOCK = 20;
export const PADDING_BLOCK = 14;

export class FieldModel {

    public index = 0;
    public inputBehavior: "appender" | "array" | "scalar" | "none" = "none";
    public outputBehavior: "standard" | "none" = "none";
    public formBehavior: "string" | "number" | "none" = "none";
    public title: string = "field";
    public inputLink: LinkModel = undefined;
    public children = new Array<FieldModel>();
    public outputLinks = new Array<FieldModel>();
    public group: FieldModel = undefined;
    public value: string | number | boolean = "";

    
    public constructor(public readonly parent: NodeModel) {
    }

    public setInputLink(from: FieldModel) {
        this.inputLink = new LinkModel(this, from);
    }

    public setOutputLink(to: FieldModel){
        this.outputLinks.push(to);
    }

    public delete() {
        for(let f of this.outputLinks){
            f.unlink();
        }
    }

    public unlink() {
        this.inputLink = undefined;
    }

    public clone(parent: NodeModel) {
        const ret = new FieldModel(parent);
        ret.index = this.index;
        ret.inputBehavior = this.inputBehavior;
        ret.outputBehavior = this.outputBehavior;
        ret.formBehavior = this.formBehavior;
        ret.group = this.group == this ? ret : undefined; // todo clone in any case
        ret.title = this.title;
        //Todo copy every fields to 'copy' case
        return ret;
    }
    public addItem(index: number): FieldModel {
        const ret = new FieldModel(this.parent);
        ret.group = this;
        ret.inputBehavior = "array";
        this.children.splice(index, 0, ret);
        this.parent.sortFields();
        return ret;
    }
    public removeItem(index: number) {
        console.info(index);
        console.info(this.children);
        this.children.splice(index - 1, 1);
        console.info(this.children);
        this.parent.sortFields();
    }
    get inputX(): number {
        return this.parent.box.x;
    }
    get inputY(): number {
        return this.parent.box.y + (this.index + 1) * SIZE_BLOCK + PADDING_BLOCK;
    }
    get outputX(): number {
        return this.parent.box.x + this.parent.box.width;
    }
    get outputY(): number {
        return this.parent.box.y + (this.index + 1) * SIZE_BLOCK + PADDING_BLOCK;
    }
}
