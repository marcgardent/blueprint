import { Position } from './Position';
import { NodeModel } from './NodeModel';
import { MetaNodeModel } from './MetaNodeModel';
import { FieldModel } from './FieldModel';
import { ShadowLinkModel } from './ShadowLinkModel';

export class BlueprintModel {
    public mouseBlueprint: Position = new Position();
    public inputField: FieldModel = undefined;
    public outputField: FieldModel = undefined;
    public selected: NodeModel = undefined;
    public readonly nodes = new Array<NodeModel>();
    public readonly arrays = new Array<NodeModel>();
    public readonly templates = new Array<MetaNodeModel>();
    public shadowLink: ShadowLinkModel = undefined;
    public shadowNode: NodeModel = undefined;
    constructor() {
    }
    public dragInput(input: FieldModel, mousePos: Position) {
        this.shadowLink = new ShadowLinkModel(new Position(input.inputX, input.inputY), mousePos);
    }
    public dragOutput(output: FieldModel, mousePos: Position) {
        this.shadowLink = new ShadowLinkModel(mousePos, new Position(output.outputX, output.outputY));
    }
    public dropLink() {
        this.shadowLink = undefined;
        this.outputField = undefined;
        this.inputField = undefined;
    }
    public unselectAll() {
        if (this.selected) {
            this.selected.selected = false;
        }
        this.selected = undefined;
    }
    public setTool(node: MetaNodeModel) {
        //this.shadowNode = node.add();
    }
    public select(node: NodeModel) {
        this.selected = node;
        this.selected.selected = true;
    }
    public addNode(node: NodeModel) {
        this.nodes.push(node);
    }
    public addArray() {
        const n = new NodeModel();
        n.title = "Array";
        this.arrays.push(n);
    }
    public addMetaNodeModels(metanodes: Array<MetaNodeModel>) {
        this.templates.push(...metanodes);
    }
    public addTemplate(node: NodeModel, name: string) {
        const t = new MetaNodeModel(node, name);
        this.templates.push(t);
        return t;
    }
    public addLink(input: FieldModel, output: FieldModel) {
        input.setInputLink(output);
        output.setOutputLink(input);
    }

    public addItem(input: FieldModel, output: FieldModel, index: number) {
        if (input.group.inputBehavior != "appender")
            debugger;
        const newfield = input.group.addItem(index);
        this.addLink(newfield, output);
    }

    public resetInput(field: FieldModel) {
        field.inputLink = undefined;
    }
    public addInput(node: NodeModel, field: FieldModel) {
        //node.inputs.push(field);
    }
    public getMetaModel(type: string): MetaNodeModel {
        const template = this.templates.filter(x => x.name == type);
        //TODO check
        return template[0];
    }
    public getNodeModel(source: any): NodeModel {
        const node = this.nodes.filter(x => x.title == source);
        //TODO check
        return node[0];
    }
    public deleteSelected():void{
        if(this.selected != undefined){
            this.deleteNode(this.selected);
            this.selected = undefined;
        }
    }
    public deleteNode(node:NodeModel) : void {
        node.delete();
        const index = this.nodes.indexOf(node, 0);
        if (index > -1) {
            this.nodes.splice(index, 1);
        }
    }
}
