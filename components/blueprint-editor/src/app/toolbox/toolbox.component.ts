import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { MetaNodeModel } from "blueprint-core/dist/models/MetaNodeModel";
import { PadModel } from 'blueprint-core/dist/models/PadModel'; 

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
  public filter : string = "";

  public get filtered(): Array<MetaNodeModel>{
    if (this.filter != ""){
      const reg = new RegExp(this.filter, "i");
      return this.context.metaNodes.filter( x=> reg.test(x.name));
    }
    else {
      return this.context.metaNodes;
    }
  }
  constructor() { }

  ngOnInit(): void {

  }

  public createInstance(template : MetaNodeModel): void {
    this.onSelected.emit(template);
    this.filter = "";
  }
}