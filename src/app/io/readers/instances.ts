import { BlueprintModel } from "app/models/BlueprintModel";
import { FieldModel } from "app/models/FieldModel";

export class InstanceBUilder {

    public constructor(private readonly context: BlueprintModel) {

    }

    public load(instances: any) {

        for (let k in instances) {
            const instance = instances[k];
            const meta = this.context.getMetaModel(instance.type);
            const node = meta.createInstance(instance.position.x, instance.position.y);
            node.title = k;

            if ('inputs' in instance) {
                for (let k in instance.inputs) {
                    const val = instance.inputs[k];
                    const field = node.getField(k);
                    this.processInput(field, val);
                }
            }

            this.context.addNode(node);
        }
    }

    private processInput(field: FieldModel, val: any) {
        if (this.isLink(val)) {
            this.processLink(field, val)
        } else if (Array.isArray(val)) {
            this.processList(field, val);
        } else if (typeof(val)==='string' || typeof(val)==='number' || typeof(val)==='boolean' ){
            field.value = val;
        } else{
            console.error("unexcepted type", typeof(val), val);
        }
    }

    private isLink(val:any){
        return typeof (val) === 'object' && 'source' in val && 'output' in val;
    }

    private processList(field:FieldModel, list:any){
        list.forEach((v,i) => {
            if (this.isLink(v)){
                const f = field.addItem(i);
                this.processLink(f, v);
            }
            else{
                console.error("excepted link, found : ", v, "at", field.title, i);
            }
        });
    }

    private processLink(field: FieldModel, link: any) {
        const node = this.context.getNodeModel(link.source);
        const source = node.getField(link.output);
        this.context.addLink(field, source);
    }
}