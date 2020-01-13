import { Position } from './Position';
import { NodeModel } from './NodeModel';
import { MetaNodeModel } from './MetaNodeModel';
import { FieldModel } from './FieldModel';
import { ShadowLinkModel } from './ShadowLinkModel';

export class BlueprintModel {
    public title: string = ""
    public mouseBlueprint: Position = new Position();
    public inputField: FieldModel = undefined;
    public outputField: FieldModel = undefined;
    public activeNode: NodeModel = undefined;
    public readonly selectedNodes = new Array<NodeModel>();
    public readonly nodes = new Array<NodeModel>();
    public readonly arrays = new Array<NodeModel>();
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

    private unactive() {
        if (this.activeNode) {
            this.activeNode.active = false;
        }
        this.activeNode = undefined;
    }

    private select(node: NodeModel) {
        if (this.selectedNodes.findIndex(x => x === node) < 0) {
            this.selectedNodes.push(node);
            node.selected = true;
        }
    }

    public unselectAll() {
        const nodes = this.selectedNodes.splice(0, this.selectedNodes.length);
        for (let n of nodes) {
            n.selected = false;
        }
        this.unactive();
    }

    public active(node: NodeModel) {
        this.unactive();
        if (this.activeNode !== node) {
            this.activeNode = node;
            this.activeNode.active = true;
        }
        this.select(node);
    }

    public addNode(node: NodeModel) {
        this.nodes.push(node);
    }

    public addArray() {
        const n = new NodeModel();
        n.title = "Array";
        this.arrays.push(n);
    }



    public addLink(input: FieldModel, output: FieldModel) {
        input.setInputLink(output);
        output.setOutputLink(input);
    }

    public addItem(input: FieldModel, output: FieldModel, index: number) {
        const newfield = input.group.addItem(index);
        this.addLink(newfield, output);
    }

    public resetInput(field: FieldModel) {
        field.inputLink = undefined;
    }

    public getNodeModel(source: any): NodeModel {
        const node = this.nodes.filter(x => x.title == source);
        return node.length==1 ?node[0] : null;
    }

    public deleteSelected(): void {
        if (this.activeNode != undefined) {
            this.deleteNode(this.activeNode);
            this.activeNode = undefined;
        }
    }

    public deleteNode(node: NodeModel): void {
        node.delete();
        const index = this.nodes.indexOf(node, 0);
        if (index > -1) {
            this.nodes.splice(index, 1);
        }
    }

    public moveSelected(dx: number, dy: number): void {
        if (dx != dy && dx != 0) {
            for (let n of this.selectedNodes) {
                n.box.move(dx, dy);
            }
        }
    }
}
