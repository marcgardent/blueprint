import { Component, OnInit, HostListener, Input } from '@angular/core';
import { NodeComponent } from '../node/node.component'
import { BlueprintModel } from "../models/BlueprintModel";
import { FieldModel } from "../models/FieldModel";
import { MetaNodeModel } from "../models/MetaNodeModel";
import { NodeModel } from "../models/NodeModel";
import { Position } from "../models/Position";
import { GameloopService } from '../gameloop.service'
import { ActiveHotkeys } from 'app/models/Hotkeys';

@Component({
  selector: 'app-blueprint',
  templateUrl: './blueprint.component.html',
  styleUrls: ['./blueprint.component.scss']
})
export class BlueprintComponent implements OnInit {
  @Input() public model: BlueprintModel;
  public get nodeCounter(): number { return this.model.nodes.length; }
  public get linkCounter(): number { return 0; }

  public paddingx = 0;
  public paddingy = 0;
  public scale = 1;
  public mouse = new Position(0, 0);
  public idle = true;
  public drag = false;
  public toolbox = false;
  public editingEnabled = false;
  public multiSelectControl = false;

  public downControl = 0;
  public upControl = 0;
  public leftControl = 0;
  public rightControl = 0;
  public toolboxPosition = new Position(0, 0);

  private velocity = new Position(0, 0);
  private pixelrate = 500 / 1000; /* pixel/ms */

  constructor(private gameloop: GameloopService) {
    this.gameloop.tick.subscribe((delta) => { this.tick(delta) })
  }

  ngOnInit() {

  }

  @HostListener('document:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {

    this.multiSelectControl = event.shiftKey;

    if (event.defaultPrevented || this.editingEnabled) {
      return;
    }
    else if (event.key == ActiveHotkeys.UNSELECT) {
      this.model.unselectAll();
    }
    else if (event.key == ActiveHotkeys.DOWN) {
      this.downControl = 0;
    }
    else if (event.key == ActiveHotkeys.UP) {
      this.upControl = 0;
    }
    else if (event.key == ActiveHotkeys.LEFT) {
      this.leftControl = 0;
    }
    else if (event.key == ActiveHotkeys.RIGHT) {
      this.rightControl = 0;
    } else if (event.key == ActiveHotkeys.UNSELECT) {
      this.model.deleteSelected();
    }
    else {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
  }

  @HostListener('document:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    
    this.multiSelectControl = event.shiftKey;

    if (event.defaultPrevented || this.editingEnabled) {
      return;
    }
    else if (event.key == ActiveHotkeys.DOWN) {
      this.downControl = 1;
    }
    else if (event.key == ActiveHotkeys.UP) {
      this.upControl = 1;
    }
    else if (event.key == ActiveHotkeys.LEFT) {
      this.leftControl = 1;
    }
    else if (event.key == ActiveHotkeys.RIGHT) {
      this.rightControl = 1;
    } else if (event.key == ActiveHotkeys.MENU) {
      this.showToolBox();
    }
    else {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
  }



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
    else if ($event.buttons == 1 && this.model.activeNode && !this.model.shadowLink) {
      // move node
      this.model.activeNode.box.x += deltaX
      this.model.activeNode.box.y += deltaY
    }
  }

  private showToolBox(): void {
    this.toolboxPosition.x = this.model.mouseBlueprint.x;
    this.toolboxPosition.y = this.model.mouseBlueprint.y;
    this.toolbox = !this.toolbox;
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

  private tick(delta: number) {
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

    if (this.drag && this.model.activeNode && !this.model.shadowLink) {
      // move node
      this.model.activeNode.box.x -= this.velocity.x / this.scale;
      this.model.activeNode.box.y -= this.velocity.y / this.scale;
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
    this.upControl = this.downControl = this.leftControl = this.rightControl = 0;
  }
}