import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BlueprintComponent } from './blueprint/blueprint.component';
import { NodeComponent } from './node/node.component';
import { MetanodeComponent } from './metanode/metanode.component';
import { FieldComponent } from './field/field.component';
import { GameloopService } from './gameloop.service';
import { ToolboxComponent } from './toolbox/toolbox.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, BlueprintComponent, NodeComponent, MetanodeComponent, FieldComponent, ToolboxComponent],
  bootstrap:    [ AppComponent ],
  providers: [GameloopService]
})
export class AppModule { }
