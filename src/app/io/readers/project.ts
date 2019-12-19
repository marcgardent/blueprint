import { BlueprintModel } from "app/models";

export interface Iloader{
    (ref:string) :  Promise<any>;
}

export class StandardFormatReader {

    public constructor(private readonly loader: Iloader, private readonly context: BlueprintModel){

    }

    public async loadProject(context: BlueprintModel, ref:string): Promise<any>{
        const project = await this.loader(ref);
        const json = await this.applyImports(project);
    }

    async applyImports(json:any): Promise<any>{
        if("imports" in json){
            for(let k in json.imports) {
                const dep = await this.loadDependency(json.imports[k]);
                json = this.merge(dep, json,'definitions')
                json = this.merge(dep, json,'instances')
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
        return {definitions : definitions};
    }
}

