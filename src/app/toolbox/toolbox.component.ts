import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { MetaNodeModel, NodeModel, BlueprintModel } from "../models"

@Component({
  selector: '[app-toolbox]',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.css']
})
export class ToolboxComponent implements OnInit {
  
  @Output() onSelected = new EventEmitter<MetaNodeModel>();
  @Input() context : BlueprintModel;
  @Input() x : number;
  @Input() y : number;

  constructor() { }

  ngOnInit(): void {

  }

  public createInstance(template : MetaNodeModel): void {
    this.onSelected.emit(template);
  }
}