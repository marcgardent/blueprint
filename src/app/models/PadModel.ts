import { BlueprintModel } from './BlueprintModel';
import { MetaNodeModel } from './MetaNodeModel';
import { NodeModel } from './NodeModel';

export class PadModel {
    public readonly collection = new Array<BlueprintModel>();
    public active: BlueprintModel = undefined;
    
    public readonly metaNodes = new Array<MetaNodeModel>();

    public addBlueprint(title: string) : BlueprintModel {
        const ret = new BlueprintModel();
        ret.title = title;
        this.collection.push(ret);
        this.active = ret;
        return ret;
    }

    public addMetaNodeModels(metanodes: Array<MetaNodeModel>) {
        this.metaNodes.push(...metanodes);
    }

    public addTemplate(node: NodeModel, name: string) {
        const t = new MetaNodeModel(node, name);
        this.metaNodes.push(t);
        return t;
    }

    public getMetaModel(type: string): MetaNodeModel {
        const template = this.metaNodes.filter(x => x.name == type);
        return template.length ==1 ? template[0] : null;
    }
}
