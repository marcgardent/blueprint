import { Box } from './Box';
import { FieldModel } from "./FieldModel";
import { MetaNodeModel } from "./MetaNodeModel";

export class NodeModel {
    public title: string = "Node";
    public active: boolean = false;
    public selected: boolean = false;
    public box: Box = new Box();
    public fields = new Array<FieldModel>();
    public template: MetaNodeModel = undefined;

    public constructor(){
        this.box.height = 150;
        this.box.width = 150;
    }
    public delete() {
        if (this.template) {
            this.template.remove(this);
        }
        for (let f of this.fields) {
            f.delete();
        }
    }

    public clone(x: number, y: number): NodeModel {
        const ret = new NodeModel();
        ret.title = this.title;
        ret.box.height = this.box.height;
        ret.box.width = this.box.width;
        ret.box.x = x;
        ret.box.y = y;
        for (let field of this.fields) {
            ret.fields.push(field.clone(ret));
        }
        ret.template = this.template;
        ret.sortFields();
        return ret;
    }

    public unlink() {
        if (this.template !== undefined) {
            this.template.remove(this);
        }
    }

    public sortFields() {
        const ret = [];
        let i = 0;
        for (let field of this.fields) {
            field.index = i;
            i++;
            for (let child of field.children) {
                child.index = i;
                i++;
            }
        }
        this.box.height = 20 * (i + 1) + 5;
    }

    public addInput(title = "input"): void {
        const field = new FieldModel(this);
        field.title = title;
        field.inputBehavior = "scalar";
        this.fields.push(field);
        this.sortFields();
    }

    public addStringInput(title = "string"): void {
        const field = new FieldModel(this);
        field.title = title;

        field.inputBehavior = "scalar";
        field.formBehavior = "string";
        this.fields.push(field);
        this.sortFields();
    }

    public addBehavior(title = "behavior") {
        const field = new FieldModel(this);
        field.title = title;
        this.fields.push(field);
        this.sortFields();
    }

    public addStringBehavior(title = "behavior") {
        const field = new FieldModel(this);
        field.title = title;
        field.formBehavior = "string";
        this.fields.push(field);
        this.sortFields();
    }

    public addOuput(title = "output") {
        const field = new FieldModel(this);
        field.title = title;
        field.outputBehavior = "standard";
        this.fields.push(field);
        this.sortFields();
    }

    public addArray(title = "appender") {
        const field = new FieldModel(this);
        field.title = title;
        field.inputBehavior = "appender";
        field.group = field;
        this.fields.push(field);
        this.sortFields();
    }

    public getField(k: string): FieldModel {
        const ret = this.fields.filter(x => x.title == k);
        return ret[0]; // TODO Check errors
    }

}



export function complexFactory(): NodeModel {
    const child = new NodeModel();
    child.box.height = 150;
    child.box.width = 100;
    child.box.x = 0;
    child.box.y = 0;
    child.addInput();
    child.addBehavior();
    child.addOuput();
    child.addArray();
    return child;
}


export function scalarFactory(): NodeModel {
    const child = new NodeModel();
    child.box.height = 50;
    child.box.width = 100;
    child.box.x = 0;
    child.box.y = 0;
    child.title = "Scalar"
    child.addOuput();
    return child;
}

export function arrayFactory(): NodeModel {
    const child = new NodeModel();
    child.box.height = 100;
    child.box.width = 100;
    child.box.x = 0;
    child.box.y = 0;
    child.title = "Array"
    child.addArray();
    child.addOuput("length");
    child.addOuput("array");
    return child;
}
