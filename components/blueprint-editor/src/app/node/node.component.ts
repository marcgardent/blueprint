import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlueprintModel } from "blueprint-core/dist/models/BlueprintModel";
import { NodeModel } from "blueprint-core/dist/models/NodeModel";
@Component({
  selector: '[app-node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {

  @Input() multiSelection = false;
  @Input() model = new NodeModel();
  @Input() context = new BlueprintModel();
  @Output() onEditing = new EventEmitter<void>();
  @Output() onEdited = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
    
  }
  
  public onClick($event: MouseEvent) {
    
    if(!this.multiSelection && !this.model.selected){
      this.context.unselectAll();
    }

    this.context.active(this.model);
  }

  public editing(){
    this.onEditing.emit();
  }
  
  public edited(){
    this.onEdited.emit();
  }
}