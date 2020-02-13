import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import YAML from 'yaml'

import { StandardFormatReader } from 'blueprint-core/dist/io/readers/project';
import { ElectronService } from 'ngx-electron';
import { PadModel } from 'blueprint-core/dist/models/PadModel';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit  {

  public context: PadModel;
  private readonly electronWindow: Electron.BrowserWindow;
  private readonly fs: any;
  
  constructor(private readonly electronService: ElectronService, private httpClient: HttpClient, private readonly cd:ChangeDetectorRef) {
    this.electronWindow = this.electronService.remote.getCurrentWindow();

    this.fs = this.electronService.remote.require("fs").promises;
    
  }

  ngOnInit(): void {
    this.context = new PadModel();

    const self=this;
    const reader = new StandardFormatReader((x)=>self.FileSystemLoader(x), this.context);
    reader.loadProject("multi-workspace.yml").then(()=> {
      self.cd.detectChanges(); // #fixed  : Zone.js is not compatible with ES2017
    })
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