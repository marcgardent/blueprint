import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FieldModel, BlueprintModel } from "../models"

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
    this.context.unselectAll();
    $event.stopPropagation();
  }

  public onDropInput($event: MouseEvent) {
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

  public onDropArray($event: MouseEvent) {
    if (this.context.outputField) {
      this.context.addLink(this.model, this.context.outputField);
    }
  }

  public onDropInter($event:MouseEvent) {
    if (this.context.outputField) {
      this.context.addItem(this.model, this.context.outputField, this.position);
    }
  }

  public onDragOutput($event: MouseEvent) {
    this.context.outputField = this.model;
    this.context.dragOutput(this.model, this.context.mouseBlueprint);
    this.context.unselectAll();
    $event.stopPropagation();
  }


  public onDropOutput($event: MouseEvent) {
    if (this.context.inputField) {
      this.context.addLink(this.context.inputField, this.model);
    }
  }

}