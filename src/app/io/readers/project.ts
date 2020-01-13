import { BlueprintModel } from "app/models/BlueprintModel";
import { loadMetaModels } from './definitions';
import { InstanceBUilder } from './instances';
import { PadModel } from 'app/models/PadModel';

export interface Iloader {
    (ref: string): Promise<any>;
}

export class StandardFormatReader {

    public constructor(private readonly loader: Iloader, private readonly context: PadModel) {

    }

    public async loadProject(ref: string): Promise<any> {
        const project = await this.loader(ref);
        const json = await this.applyImports(project);
        this.context.addMetaNodeModels(loadMetaModels(json.definitions));
        console.debug("definitions loaded", this.context.metaNodes);
        if ('blueprints' in json) {
            for(let blueprintTitle in json.blueprints) {
                const blueprint = this.context.addBlueprint(blueprintTitle);
                const inst = new InstanceBUilder(this.context, blueprint);
                inst.load(json.blueprints[blueprintTitle]);
            }
        }
    }

    async applyImports(json: any): Promise<any> {
        if ("imports" in json) {
            const imports = json.imports
            for (let k in imports) {
                const dep = await this.loadDependency(imports[k]);
                json = {
                    definitions: this.merge(dep, json, 'definitions'),
                    blueprints: this.merge(dep, json, 'blueprints')
                }
            }
            return json;
        }
        else {
            return json;
        }
    }

    async loadDependency(reference: string): Promise<any> {
        const raw = this.loader(reference);
        return this.applyImports(raw);
    }

    merge(base: any, override: any, ref: string) {
        const definitions = ref in base ? base.definitions : {};
        const override_definitions = ref in override ? override[ref] : {};
        for (let def in override_definitions) {
            if (def in definitions) {
                console.debug("override", def, base.__file__, override.__file__);
            }
            definitions[def] = override_definitions[def];
        }
        return definitions;
    }
}

