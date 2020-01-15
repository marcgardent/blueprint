import { BlueprintModel } from './BlueprintModel';
import { MetaNodeModel } from './MetaNodeModel';
import { NodeModel } from './NodeModel';


export class PadModel  {
    public readonly collection = new Array<BlueprintModel>();
    public active: BlueprintModel = undefined;
    
    public readonly metaNodes = new Array<MetaNodeModel>();

    public constructor(){
        this.addbuiltinInputType();
        this.addbuiltinOutputType();
    }

    public addBlueprint(title: string) : BlueprintModel {
        const ret = new BlueprintModel();
        ret.title = title;
        this.collection.push(ret);
        this.active = ret;
        return ret;
    }

    public addMetaNodeModels(...metanodes: MetaNodeModel[]) {
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

    private addbuiltinInputType() : void{
        const input = new NodeModel();
        input.title = "input";
        input.addStringBehavior("description");
        input.addOuput("in");
        const inputMeta = new MetaNodeModel(input, "input");
        this.addMetaNodeModels(inputMeta);
    }

    private addbuiltinOutputType() : void{
        const output = new NodeModel();
        output.title = "output";
        output.addStringBehavior("description");
        output.addInput("out");
        const outputMeta = new MetaNodeModel(output, "output");
        this.addMetaNodeModels(outputMeta);
    }
}
