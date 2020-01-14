import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { BlueprintModel } from "../models/BlueprintModel";
import { MetaNodeModel } from "../models/MetaNodeModel";
import { NodeModel } from "../models/NodeModel";
import { PadModel } from 'app/models/PadModel';

@Component({
  selector: '[app-toolbox]',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.css']
})
export class ToolboxComponent implements OnInit {
  
  @Output() onSelected = new EventEmitter<MetaNodeModel>();
  @Input() context : PadModel;
  @Input() x : number;
  @Input() y : number;

  constructor() { }

  ngOnInit(): void {

  }

  public createInstance(template : MetaNodeModel): void {
    this.onSelected.emit(template);
  }
}