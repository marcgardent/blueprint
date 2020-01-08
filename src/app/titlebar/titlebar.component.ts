import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.css']
})
export class TitlebarComponent implements OnInit {
  private readonly electronWindow: Electron.BrowserWindow;
  
  constructor(private readonly electronService: ElectronService) {
    this.electronWindow = this.electronService.remote.getCurrentWindow();
  }

  ngOnInit() {
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
