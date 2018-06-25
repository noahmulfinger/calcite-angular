import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CalciteAngularModule } from 'calcite-angular';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CalciteAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
