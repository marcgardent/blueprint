import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {NodeModel, BlueprintModel } from '../models';
@Component({
  selector: '[app-node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {

  @Input() model = new NodeModel();
  @Input() context = new BlueprintModel();
  @Output() onEditing = new EventEmitter<void>();
  @Output() onEdited = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
    
  }
  public onClick($event: MouseEvent) {
    this.context.unselectAll();
    this.context.select(this.model);

    //$event.stopPropagation();
  }

  public editing(){
    this.onEditing.emit();
  }
  
  public edited(){
    this.onEdited.emit();
  }
}