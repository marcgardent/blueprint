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
    template.box.width = 150;
    template.box.x = 0;
    template.box.y = 0;
    template.title = name;
    for(let input in json.inputs){
        const def = loadType(json.inputs[input])
        if(def.type.startsWith("list")){
            template.addArray(input)
        }
        else if(def.type == "string") {
            template.addStringInput(input);
        }
        else{
            template.addInput(input + ":"+ def.type)
        }
    }

    for(let output in json.outputs){
        const def = loadType(json.outputs[output])
        template.addOuput(output + ":"+ def.type);
    }

    return new MetaNodeModel(template, name);
}

function loadType(json:any) :{type:string, description:string}{
    if(typeof json === "string"){
        return {
            type: json,
            description: "",

        }
    }
    else{
        return {
            type: json.type,
            description: "description" in json ? json.description : ""
        }
    }
}