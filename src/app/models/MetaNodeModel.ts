import { NodeModel } from './NodeModel';
import { BindingModel, ExportModel } from './ExportModel';

export class MetaNodeModel {
    public binding: BindingModel = undefined;
    public readonly instances: Array<NodeModel> = new Array();
    public constructor(public readonly template: NodeModel, public readonly name) {
    }
    public remove(node: NodeModel) {
        const index = this.instances.indexOf(node, 0);
        if (index > -1) {
            this.instances[index].template = undefined;
            this.instances.splice(index, 1);
        }
    }
    public add(node: NodeModel) {
        this.instances.push(node);
        node.template = this;
    }
    public createInstance(x: number, y: number): NodeModel {
        const ret = this.template.clone(x, y);
        this.add(ret);
        return ret;
    }
}
