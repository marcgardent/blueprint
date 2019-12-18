import { Component, OnInit } from '@angular/core';
import * as metatypes from 'app/data/protogame.json';
import { BlueprintModel } from './models.js';
import { loadMetaModelsFromJson} from 'app/io/metamodel'
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit  {

  public context: BlueprintModel;

  ngOnInit(): void {
    console.debug("init!!")
    this.context = new BlueprintModel();
    this.context.addMetaNodeModels(loadMetaModelsFromJson(metatypes.default));

  }
}