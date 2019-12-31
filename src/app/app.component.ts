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
  
  constructor(private readonly electronService: ElectronService, private httpClient: HttpClient) {
    this.electronWindow = this.electronService.remote.getCurrentWindow();
  }

  ngOnInit(): void {
    this.context = new BlueprintModel();

   

    //const self=this;
    //const reader = new StandardFormatReader((x)=>self.httpClientLoader(x), this.context);
    //reader.loadProject(this.context, "project.yml");
  }

  async httpClientLoader(ref:string): Promise<any>{
    const data = await this.httpClient.get("assets/data/"+ ref, {responseType: 'text'}).toPromise();
    const json = YAML.parse(data);
    json.__file__ = ref;
    return json;
  }
  

  public get isMaximized() : boolean{
    return this.electronWindow ? this.electronWindow.isMaximized() : false;
  }

  public minimize(){
    this.electronWindow.minimize();
  }
    
  public maximize(){
    this.electronWindow.maximize();
  }

  public unmaximize(){
    this.electronWindow.unmaximize();
  }

  public close(){
    this.electronWindow.close();
  }
}