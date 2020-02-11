import { ExportModel, BindingModel } from 'app/models/ExportModel';
import { NodeModel } from 'app/models/NodeModel';
import { PadModel } from 'app/models/PadModel';
import { Environment } from 'nunjucks';
import { BlueprintModel } from 'app/models/BlueprintModel';

interface IReferences {
    [key: string]: Array<string>;
}

export class NunjucksBuilder {
    private imports: Map<string, Array<string>> = new Map();
    private blueprint: string = "JohnDoe";
    private content: string = "None";
    private inputs: Map<string, string> = new Map();

    constructor(private readonly model: ExportModel,
        private readonly env = new Environment()) {
        env.addFilter('as_kvargs', function (keyvalue: Map<string, string>, kvSeparator: string, argSeparator: string) {
            const ret = Array();
            const sep = kvSeparator || ":";
            for (let k in keyvalue) {
                ret.push(k + sep + keyvalue[k]);
            }
            return ret.join(argSeparator || ",");
        });
    }

    public addImport(binding: BindingModel) {
        this.model.import_statement
        if (!this.imports.has(binding.module)) {
            this.imports.set(binding.module, new Array());
        }

        this.imports.get(binding.module).push(binding.reference);

        return this;
    }

    public toFile(path: string) {
        const ret = this.env.renderString(this.model.blueprint_file,
            {
                imports: this.imports,
                blueprint: this.blueprint
            })
        console.debug(path, ret)
    }

    public addDefinition(reference: string, factoryTemplate: string, build: (x: NunjucksDefinitionBuilder) => void) {
        const b = new NunjucksDefinitionBuilder(this.env);
        build(b);
        b.toString(factoryTemplate, reference);
    }
}

export class NunjucksDefinitionBuilder {

    private readonly attributes: Map<String, String> = new Map();

    constructor(private readonly env: Environment) {

    }

    public addRaw(k: string, v: string): NunjucksDefinitionBuilder {
        this.attributes.set(k, v);
        return this;
    }

    public addString(k: string, v: string): NunjucksDefinitionBuilder {
        this.attributes.set(k, '"' + v + '"'); //TODO design : template for format+Escape
        return this;
    }

    public toString(factorTemplate: string, reference: string): string {
        return "";
    }
}

export interface IBuilder {
}

export class Director {

    constructor(private readonly exportModel: ExportModel) {


    }

    public export(pad: PadModel) {

        for (let blueprint of pad.collection) {
            const b = new NunjucksBuilder(this.exportModel);
            this.exportBlueprint(b, blueprint);
            b.toFile(blueprint.title + "." + this.exportModel.extension);
        }
    }

    private exportBlueprint(builder: NunjucksBuilder, blueprint: BlueprintModel): void {
        for (let node of blueprint.nodes) {
            this.exportNode(builder, node);
        }
    }

    private exportNode(builder: NunjucksBuilder, node: NodeModel) {        
        const factoryName = node.template.binding.factory
        if (factoryName in this.exportModel.factories) {

            builder.addDefinition(NodeModel.name, this.exportModel.factories[factoryName],
                x => {
                    for (let attr of node.fields) {
                        if(attr.isConstant){
                            if (attr.formBehavior == "string"){
                                x.addString(attr.title, attr.value.toString());
                            }
                            else {
                                x.addRaw(attr.title, attr.value.toString());
                            }
                        }
                    }
                });
        }
        else {
            console.debug("to export '" + NodeModel.name + "' can't found the factory '" + factoryName + "' : check speeling or add the factory definition")
        }

    }
}