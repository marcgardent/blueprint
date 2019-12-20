import { BlueprintModel } from "app/models";
import { loadMetaModels } from './definitions';

export interface Iloader{
    (ref:string) :  Promise<any>;
}

export class StandardFormatReader {

    public constructor(private readonly loader: Iloader, private readonly context: BlueprintModel){

    }

    public async loadProject(context: BlueprintModel, ref:string): Promise<any>{
        const project = await this.loader(ref);
        const json = await this.applyImports(project);
        context.addMetaNodeModels(loadMetaModels(json.definitions));

        //TODO design LOAD instance Func
        for(let k in json.instances){
            const instance = json.instances[k];
            const meta = context.getMetaModel(instance.type);
            const node = meta.createInstance(instance.position.x, instance.position.y);
            node.title = k;

            if('inputs'in instance) {
                for(let k in instance.inputs){
                    const val = instance.inputs[k];
                    const field = node.getField(k);
                    if(typeof(val) === 'object'){
                            //todo link
                        if( 'source' in val && 'output' in val){
                            const node = context.getNodeModel(val.source);
                            const source = node.getField(val.output);
                            context.addLink(field, source);
                        }
                    } else{
                        field.value = val;
                    }
                }
            }

            context.addNode(node);
            console.debug("added", node);
        }   
    }

    async applyImports(json:any): Promise<any>{
        if("imports" in json){
            const imports = json.imports
            for(let k in imports) {
                const dep = await this.loadDependency(imports[k]);
                json = {
                    definitions : this.merge(dep, json,'definitions'),
                    instances : this.merge(dep, json,'instances')
                }
            }
            return json;
        }
        else {
            return json;
        }
    }

    async loadDependency(reference: string): Promise<any>{
        const raw = this.loader(reference);
        return this.applyImports(raw);
    }

    merge(base:any, override:any, ref: string) {
        const definitions = ref in base ? base.definitions : {};
        const override_definitions = ref in override ? override[ref] : {};
        for(let def in override_definitions) {
            if(def in definitions) {
                console.debug("override", def, base.__file__, override.__file__);
            }
            definitions[def] = override_definitions[def];
        }
        return  definitions;
    }
}

