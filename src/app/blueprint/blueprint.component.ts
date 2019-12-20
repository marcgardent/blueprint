import { Component, OnInit, HostListener, Input } from '@angular/core';
import { NodeComponent } from '../node/node.component'
import { NodeModel, BlueprintModel, FieldModel, Position, MetaNodeModel } from '../models'
import { GameloopService } from '../gameloop.service'

@Component({
  selector: 'app-blueprint',
  templateUrl: './blueprint.component.html',
  styleUrls: ['./blueprint.component.scss']
})
export class BlueprintComponent implements OnInit {
  public paddingx = 0;
  public paddingy = 0;
  public scale = 1;
  public mouse = new Position(0, 0);
  public idle = true;
  public drag = false;
  public toolbox = false;
  public editingEnabled = false;

  @Input() public model: BlueprintModel;

  public get nodeCounter(): number { return this.model.nodes.length; }
  public get linkCounter(): number { return 0; }

  public downControl = 0;
  public upControl = 0;
  public leftControl = 0;
  public rightControl = 0;
  private velocity = new Position(0, 0);
  public toolboxPosition = new Position(0, 0);

  constructor(private gameloop: GameloopService) {
    this.gameloop.tick.subscribe((delta) => { this.tick(delta) })
  }

  ngOnInit() {

  }

  private complexFactory(): NodeModel {
    const child = new NodeModel();
    child.box.height = 150;
    child.box.width = 100;
    child.box.x = 0;
    child.box.y = 0;
    child.addInput();
    child.addBehavior();
    child.addOuput();
    child.addArray();
    return child;
  }

  //@HostListener('document:keydown.w', ['$event'])
  public scalarFactory(): NodeModel {
    const child = new NodeModel();
    child.box.height = 50;
    child.box.width = 100;
    child.box.x = 0;
    child.box.y = 0;
    child.title = "Scalar"
    child.addOuput();
    return child;
  }

  //@HostListener('document:keydown.x', ['$event'])
  public arrayFactory(): NodeModel {
    const child = new NodeModel();
    child.box.height = 100;
    child.box.width = 100;
    child.box.x = 0;
    child.box.y = 0;
    child.title = "Array"
    child.addArray();
    child.addOuput("length");
    child.addOuput("array");
    return child;
  }


  @HostListener('document:keydown.z', ['$event'])
  public upBegin(): void { this.upControl = 1; }
  @HostListener('document:keyup.z', ['$event'])
  public upEnd(): void { this.upControl = 0; }

  @HostListener('document:keydown.s', ['$event'])
  public downBegin(): void { this.downControl = 1; }

  @HostListener('document:keyup.s', ['$event'])
  public downEnd(): void { this.downControl = 0; }

  @HostListener('document:keydown.d', ['$event'])
  public rightBegin(): void { this.rightControl = 1; }

  @HostListener('document:keyup.d', ['$event'])
  public rightEnd(): void { this.rightControl = 0; }

  @HostListener('document:keydown.q', ['$event'])
  public leftBegin(): void { this.leftControl = 1; }

  @HostListener('document:keyup.q', ['$event'])
  public leftEnd(): void { this.leftControl = 0; }



  @HostListener('window:wheel', ['$event'])
  onScroll($event: WheelEvent) {
    const newscale = this.scale + 0.1 * ($event.deltaY / 120)
    if (newscale > 0.01) {
      this.scale = newscale
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp($event: MouseEvent) {
    this.model.dropLink();
    this.drag = $event.buttons == 1;
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu($event: MouseEvent) {
    $event.preventDefault()
    $event.stopPropagation()
  }


  @HostListener('mousedown', ['$event'])
  onMouseDown($event: MouseEvent) {
    this.drag = $event.buttons == 1;
  }


  @HostListener('mousemove', ['$event'])
  onMouseMove($event: MouseEvent) {
    this.setMouse($event.clientX, $event.clientY)
    const deltaX = $event.movementX / window.devicePixelRatio;
    const deltaY = $event.movementY / window.devicePixelRatio;

    if ($event.buttons == 2 || $event.buttons == 4) {
      // move workspace
      this.paddingx += deltaX;
      this.paddingy += deltaY;
      $event.preventDefault()
      $event.stopPropagation()
    }
    else if ($event.buttons == 1 && this.model.selected && !this.model.shadowLink) {
      // move node
      this.model.selected.box.x += deltaX
      this.model.selected.box.y += deltaY
    }
  }

  @HostListener('document:keydown.a', ['$event'])
  public onClick() {
    this.model.unselectAll();
  }

  @HostListener('document:keydown.del', ['$event'])
  public onDelete() {
    console.info("ee")
  }

  @HostListener('document:keydown.f1', ['$event'])
  public onToolbox($event: KeyboardEvent): void {
    this.toolboxPosition.x = this.model.mouseBlueprint.x;
    this.toolboxPosition.y = this.model.mouseBlueprint.y;
    this.toolbox = !this.toolbox;
    event.stopPropagation();
    event.preventDefault();
  }

  private setMouse(x, y) {
    this.mouse.x = x;
    this.mouse.y = y;
    this.updateLogicMouse();
  }

  private CoordBlueprintX(x) {
    return (x - this.paddingx) / this.scale;
  }

  private CoordBlueprintY(y) {
    return (y - this.paddingy) / this.scale;
  }

  private pixelrate = 500 / 1000; /* pixel/ms */
  private tick(delta: number) {
    if (!this.editingEnabled) {
      // acceleration
      const accX = this.leftControl - this.rightControl;
      const accY = this.upControl - this.downControl;
      this.velocity.x += accX * delta / 2;
      this.velocity.y += accY * delta / 2;

      this.velocity.scale(0.5); // air resistance ;)
      const epsilon = 0.01;
      if (this.velocity.x < epsilon && this.velocity.x > -epsilon) { this.velocity.x = 0; }
      if (this.velocity.y < epsilon && this.velocity.y > -epsilon) { this.velocity.y = 0; }

      //move
      this.paddingy += this.velocity.y;
      this.paddingx += this.velocity.x;
      this.updateLogicMouse();

      if (this.drag && this.model.selected && !this.model.shadowLink) {
        // move node
        this.model.selected.box.x -= this.velocity.x / this.scale;
        this.model.selected.box.y -= this.velocity.y / this.scale;
      }
    }
  }

  public updateLogicMouse() {

    // update logic mouse
    this.model.mouseBlueprint.x = this.CoordBlueprintX(this.mouse.x);
    this.model.mouseBlueprint.y = this.CoordBlueprintY(this.mouse.y);
  }

  public focus() {
    this.idle = false;
  }

  public blur() {
    //this.idle = true;
  }

  public onSelectedTemplate(template: MetaNodeModel) {
    this.toolbox = false;
    console.debug("create node!", template, this.model.mouseBlueprint)
    const instance = template.createInstance(this.model.mouseBlueprint.x, this.model.mouseBlueprint.y);
    this.model.addNode(instance);
  }

  public nodeEdited(): void {
    this.editingEnabled = false;
  }
  public nodeEditing(): void {
    this.editingEnabled = true;
  }
}