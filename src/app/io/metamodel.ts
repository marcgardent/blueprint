import { MetaNodeModel, NodeModel } from "app/models";

export function loadMetaModelsFromJson(json: any):  Array<MetaNodeModel> {

    const ret = new Array<MetaNodeModel>();

    for (let key in  json) {
        ret.push(loadMetaModel(key, json[key]));
        console.debug("metamodel loaded", key, json[key]);
    }

    return ret;
}

function loadMetaModel(name:string, json : any): MetaNodeModel{
    const template = new NodeModel();
    template.box.height = 150;
    template.box.width = 100;
    template.box.x = 0;
    template.box.y = 0;

    template.addBehavior(name);

    return new MetaNodeModel(template, name);
}