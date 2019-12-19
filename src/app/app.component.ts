import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import YAML from 'yaml'

import { BlueprintModel } from './models'; 
import { StandardFormatReader } from './io/readers/project';

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
    const self=this;
    const reader = new StandardFormatReader((x)=>self.httpClientLoader(x), this.context);
    reader.loadProject(this.context, "project.yml");
  }

  async httpClientLoader(ref:string): Promise<any>{
    const data = await this.httpClient.get("assets/data/"+ ref, {responseType: 'text'});
    const json = YAML.parse(data);
    json.__file__ = ref;
    return json;
  }
}