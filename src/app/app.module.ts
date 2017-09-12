import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { StatusReflectorComponent } from './status-reflector/status-reflector.component';
import { DataService } from './data.service';
import { GraphViewComponent } from './graph-view/graph-view.component';

@NgModule({
  declarations: [
    AppComponent,
    StatusReflectorComponent,
    GraphViewComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
