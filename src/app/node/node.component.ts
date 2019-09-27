import { Component, OnInit, Input } from '@angular/core';
import {NodeModel, BlueprintModel } from '../models';
@Component({
  selector: '[app-node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {

  @Input() model = new NodeModel();
  @Input() context = new BlueprintModel();

  constructor() { }

  ngOnInit() {
    
  }
  public onClick($event: MouseEvent) {
    this.context.unselectAll();
    this.context.select(this.model);

    //$event.stopPropagation();
  }
}