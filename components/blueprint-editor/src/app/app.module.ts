import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BlueprintComponent } from './blueprint/blueprint.component';
import { NodeComponent } from './node/node.component';
import { FieldComponent } from './field/field.component';
import { GameloopService } from './gameloop.service';
import { ToolboxComponent } from './toolbox/toolbox.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxElectronModule } from 'ngx-electron';
import { TitlebarComponent } from './titlebar/titlebar.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, NgxElectronModule, HttpClientModule ],
  declarations: [ AppComponent, BlueprintComponent, NodeComponent, FieldComponent, ToolboxComponent, TitlebarComponent],
  bootstrap:    [ AppComponent ],
  providers: [GameloopService]
})
export class AppModule { }
