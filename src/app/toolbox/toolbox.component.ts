import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NodeModel, BlueprintModel } from "../models"

@Component({
  selector: '[app-toolbox]',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.css']
})
export class ToolboxComponent implements OnInit {
  
  @Output() onSelected = new EventEmitter<NodeModel>();
  @Input() context : BlueprintModel;

  constructor() { }

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

}