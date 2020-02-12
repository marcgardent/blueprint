import { BlueprintModel } from "models/BlueprintModel";
import { FieldModel } from "models/FieldModel";
import { PadModel } from 'models/PadModel';
import { NodeModel } from 'models/NodeModel';

export class InstanceBUilder {

    public constructor(private readonly context: PadModel, private readonly blueprint: BlueprintModel) {

    }

    public load(instances: any) {
        const todoLinks = new Array<{ node: NodeModel, inputs: any }>();

        for (let k in instances) {
            const instance = instances[k];

            const meta = this.context.getMetaModel(instance.type);
            if (meta != null) {
                const node = meta.createInstance(instance.position.x, instance.position.y);
                node.title = k;

                if ('inputs' in instance) {
                    todoLinks.push({ node: node, inputs: instance['inputs'] });
                }
                
                this.blueprint.addNode(node);
                console.debug("instance '" + this.blueprint.title + "." + k + "' is added")
            }
            else {
                console.error("cannot resolve the type '" + instance.type + "' to add '" + k + "' : declare the definition")
            }
        }

        // set field and make links
        for (let todo of todoLinks) {
            const node = todo.node;
            for (let k in todo.inputs) {
                const val = todo.inputs[k];
                const field = node.getField(k);
                this.processInput(field, val);
            }
        }
    }

    private processInput(field: FieldModel, val: any) {
        if (this.isLink(val)) {
            this.processLink(field, val)
        } else if (Array.isArray(val)) {
            this.processList(field, val);
        } else if (typeof (val) === 'string' || typeof (val) === 'number' || typeof (val) === 'boolean') {
            field.value = val;
        } else {
            console.error("unexcepted type", typeof (val), val);
        }
    }

    private isLink(val: any) {
        return typeof (val) === 'object' && 'source' in val && 'output' in val;
    }

    private processList(field: FieldModel, list: any) {
        list.forEach((v:any, i:number) => {
            if (this.isLink(v)) {
                const f = field.addItem(i);
                this.processLink(f, v);
            }
            else {
                console.error("excepted link, found : ", v, "at", field.title, i);
            }
        });
    }

    private processLink(field: FieldModel, link: any) {
        const node = this.blueprint.getNodeModel(link.source);
        if (node != null) {
            const source = node.getField(link.output);
            this.blueprint.addLink(field, source);
        }
        else {
            console.error("cannot find the instance '" + link.source + "' to link the field '" + field.parent.title + "." + field.title + "' : set with an node's name")
        }
    }
}