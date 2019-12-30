import { Component, OnInit, Input  } from '@angular/core';
import { BlueprintModel } from "../models/BlueprintModel";
import { FieldModel } from "../models/FieldModel";

@Component({
  selector: '[app-field]',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {

  @Input()
  model : FieldModel;


  @Input()
  context : BlueprintModel;

  @Input()
  position : number =0;
  
  constructor() { }

  ngOnInit() {

  }

  public onDragInput($event: MouseEvent) {
    if (this.model.inputLink == undefined) {
      this.context.inputField = this.model;
      this.context.dragInput(this.model, this.context.mouseBlueprint);
    }
    else {
      this.context.outputField = this.model.inputLink.output;
      this.context.resetInput(this.model);
      this.context.dragOutput(this.context.outputField, this.context.mouseBlueprint);
    }
    //todo why? this.context.unactive();
    $event.stopPropagation();
  }

  public onDropInput() {
    if (this.context.outputField) {
      this.context.addLink(this.model, this.context.outputField);
    }
  }

  public onDragArray($event: MouseEvent) {
    if (this.model.inputLink !== undefined) {  
      this.model.group.removeItem(this.position);
      this.context.dragInput(this.model, this.context.mouseBlueprint);
    }

    this.onDragInput($event);
  }

  public onDropArray() {
    if (this.context.outputField) {
      this.context.addLink(this.model, this.context.outputField);
    }
  }

  public onDropInter() {
    if (this.context.outputField) {
      this.context.addItem(this.model, this.context.outputField, this.position);
    }
  }

  public onDragOutput($event: MouseEvent) {
    this.context.outputField = this.model;
    this.context.dragOutput(this.model, this.context.mouseBlueprint);
    //todo ???? this.context.unactive();
    $event.stopPropagation();
  }


  public onDropOutput() {
    if (this.context.inputField) {
      this.context.addLink(this.context.inputField, this.model);
    }
  }

}