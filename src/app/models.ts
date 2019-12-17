
export class Position {

  constructor(
    public x: number = 0,
    public y: number = 0) {
  }

  public add(dx, dy){
    this.x +=dx;
    this.y +=dy;
  }

  public scale(factor){
    this.x *=factor;
    this.y *=factor;
  }
}

export class Box {
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;
}

export class NodeModel {

  public title: string = "Node";
  public selected: boolean = false;
  public box: Box = new Box();

  public fields = new Array<FieldModel>();
  public template: MetaNodeModel = undefined;

  public clone(x:number, y:number) : NodeModel {
    const ret = new NodeModel();
    ret.title = this.title;
    ret.box.height = this.box.height;
    ret.box.width = this.box.width;
    ret.box.x = x;
    ret.box.y = y;

    for(let field of this.fields){
      ret.fields.push(field.clone(ret));
    }
    ret.template = this.template;
    ret.sortFields();
     return ret;
  }

  public unlink() {
    if (this.template !== undefined) {
      this.template.remove(this);
    }
  }

  public sortFields() {
    const ret = []
    let i = 0;
    for(let field of this.fields){
      field.index = i;
      i++;
      for(let child of field.children){
        child.index = i; 
        i++;
      }
    }
    this.box.height = 20 * (i+ 1)+5;
  }

  public addInput(title="input") {
    const field = new FieldModel(this);
    field.title = title;
    field.inputBehavior = "scalar"
    this.fields.push(field);
    this.sortFields();
  }

  public addBehavior(title="behavior") {
    const field = new FieldModel(this);
    field.title =title;
    this.fields.push(field);
    this.sortFields();
  }
 
  public addOuput(title="output") {
    const field = new FieldModel(this);
    field.title =title;
    field.outputBehavior = "standard"
    this.fields.push(field);
    this.sortFields();
  }

  public addArray() {
    const field = new FieldModel(this);
    field.inputBehavior = "appender"
    field.group = field;
    this.fields.push(field);
    this.sortFields();
  }
}

export class MetaNodeModel {
  
  public readonly instances: Array<NodeModel> = new Array();
  public constructor(public readonly template: NodeModel, public readonly name) {

  }

  public remove(node: NodeModel) {
    const index = this.instances.indexOf(node, 0);
    if (index > -1) {
      this.instances[index].template = undefined;
      this.instances.splice(index, 1);
    }
  }

  public add(node: NodeModel) {
    this.instances.push(node);
    node.template = this;
  }

  public createInstance(x:number, y:number) : NodeModel{
    const ret = this.template.clone(x,y);
    this.add(ret);
    return ret;
  }
}

export class LinkModel {

  public constructor(
    public readonly input: FieldModel,
    public readonly output: FieldModel) {
  }

  public get curvePath() {
    return ShadowLinkModel.getCurvePath(this.output.outputX, this.output.outputY, this.input.inputX, this.input.inputY);
  }
}

const SIZE_BLOCK = 20;
const PADDING_BLOCK = 14;

export class FieldModel {
  public index = 0;
  public inputBehavior: "appender" | "array" | "scalar" | "none" = "none";
  public outputBehavior: "standard" | "none" = "none";

  public title: string = "field"
  public inputLink: LinkModel = undefined;
  public children = new Array<FieldModel>();
  public group : FieldModel = undefined;

  public setInputLink(from :FieldModel){
    this.inputLink = new LinkModel(this,from);
  }

  public constructor(public readonly parent: NodeModel) {

  }

  public clone(parent:NodeModel) {
    const ret = new FieldModel(parent);
    ret.index = this.index;
    ret.inputBehavior = this.inputBehavior;
    ret.outputBehavior = this.outputBehavior;
    ret.group = this.group == this ? ret : undefined; // todo clone in any case
    ret.title = this.title;
    //Todo copy every fields to 'copy' case
    return ret;
  }

  public addItem(index : number): FieldModel {
    const ret = new FieldModel(this.parent);
    ret.group = this;
    ret.inputBehavior = "array";
    
    this.children.splice(index,0,ret);
    this.parent.sortFields();
    return ret;
  }

  public removeItem(index: number) {
    console.info(index);
    console.info(this.children);
    this.children.splice(index-1, 1);
    console.info(this.children);

    this.parent.sortFields();
  }

  get inputX(): number {
    return this.parent.box.x;
  }

  get inputY(): number {
    return this.parent.box.y + (this.index+1) * SIZE_BLOCK + PADDING_BLOCK;
  }

  get outputX(): number {
    return this.parent.box.x + this.parent.box.width;
  }

  get outputY(): number {
    return this.parent.box.y + (this.index+1) * SIZE_BLOCK + PADDING_BLOCK;
  }
}

export class ShadowLinkModel {

  constructor(public inputPos: Position, public outputPos: Position) {

  }

  public get curvePath() {
    return ShadowLinkModel.getCurvePath(this.outputPos.x, this.outputPos.y, this.inputPos.x, this.inputPos.y);
  }

  public static getCurvePath(x1, y1, x2, y2) {
    const smooth = Math.abs(x1 - x2) * 0.5;
    const cx1 = x1 + smooth;
    const cy1 = y1;
    const cx2 = x2 - smooth;
    const cy2 = y2;
    return "M " + x1 + " " + y1 + " C " + cx1 + " " + cy1 + " " + cx2 + " " + cy2 + " " + x2 + " " + y2;
  }
}

export class BlueprintModel {
  public mouseBlueprint : Position =new Position();

  public inputField: FieldModel = undefined;
  public outputField: FieldModel = undefined;
  public selected: NodeModel = undefined
  public readonly nodes = new Array<NodeModel>();
  public readonly arrays = new Array<NodeModel>();
  public readonly templates = new Array<MetaNodeModel>();
  public shadowLink: ShadowLinkModel = undefined;
  public shadowNode: NodeModel= undefined;

  constructor() {

  }

  public dragInput(input: FieldModel, mousePos: Position) {
    this.shadowLink = new ShadowLinkModel(new Position(input.inputX, input.inputY), mousePos);
  }

  public dragOutput(output: FieldModel, mousePos: Position) {
    this.shadowLink = new ShadowLinkModel(mousePos, new Position(output.outputX, output.outputY));
  }

  public dropLink() {
    this.shadowLink = undefined;
    this.outputField = undefined;
    this.inputField = undefined;
  }

  public unselectAll() {
    if (this.selected) {
      this.selected.selected = false;
    }
    this.selected = undefined;
  }

  public setTool(node: MetaNodeModel){
    //this.shadowNode = node.add();
  }

  public select(node: NodeModel) {
    this.selected = node;
    this.selected.selected = true;
  }

  public addNode(node: NodeModel) {
    this.nodes.push(node);
  }

  public addArray() {
    const n = new NodeModel();
    n.title = "Array"
    this.arrays.push(n);
  }

  public addTemplate(node: NodeModel, name:string) {
    const t = new MetaNodeModel(node, name);
    this.templates.push(t);
    return t;
  }

  public addLink(input: FieldModel, output: FieldModel) {
    input.setInputLink(output);
  }

  public addItem(input: FieldModel, output: FieldModel, index: number) {
    if(input.group.inputBehavior != "appender") debugger;
    const newfield = input.group.addItem(index);
    newfield.setInputLink(output);
  }
  
  public resetInput(field: FieldModel) {
    field.inputLink = undefined;
  }

  public addInput(node: NodeModel, field: FieldModel) {
    //node.inputs.push(field);
    
  }
}