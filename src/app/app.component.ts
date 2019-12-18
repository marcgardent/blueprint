import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import YAML from 'yaml'

import { BlueprintModel } from './models.js';
import { loadMetaModelsFromJson} from 'app/io/metamodel'
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit  {

  public context: BlueprintModel;
  
  constructor(private httpClient: HttpClient) {

  }

  ngOnInit(): void {
    this.context = new BlueprintModel();

    this.httpClient.get("assets/data/protogame.yml", {responseType: 'text'}).subscribe(data =>{
      const metatypes = YAML.parse(data);
      this.context.addMetaNodeModels(loadMetaModelsFromJson(metatypes));
    });
  }
}