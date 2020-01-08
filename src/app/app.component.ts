import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import YAML from 'yaml'


import { BlueprintModel } from "./models/BlueprintModel";
import { StandardFormatReader } from './io/readers/project';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit  {

  public context: BlueprintModel;
  private readonly electronWindow: Electron.BrowserWindow;
  private readonly fs: any;
  
  constructor(private readonly electronService: ElectronService, private httpClient: HttpClient) {
    this.electronWindow = this.electronService.remote.getCurrentWindow();

    this.fs = this.electronService.remote.require("fs").promises;
  }

  ngOnInit(): void {
    this.context = new BlueprintModel();

    const self=this;
    const reader = new StandardFormatReader((x)=>self.FileSystemLoader(x), this.context);
    reader.loadProject(this.context, "myworkspace.yml");
  }

  async FileSystemLoader(ref:string): Promise<any>{
    const data = await this.fs.readFile("D:/tmp/blueprint/samples/py-protogame/"+ ref, "utf8");
    const json = YAML.parse(data);
    json.__file__ = ref;
    return json;
  }
  

  async httpClientLoader(ref:string): Promise<any>{
    const data = await this.httpClient.get("assets/data/"+ ref, {responseType: 'text'}).toPromise();
    const json = YAML.parse(data);
    json.__file__ = ref;
    return json;
  }
  

}