import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ConfigPainelComponent } from './config-painel/config-painel.component';
import { SliderModule } from 'primeng/slider';
import {ChartModule} from 'primeng/chart';


@NgModule({
  declarations: [
    AppComponent,
    ConfigPainelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SliderModule,
    BrowserAnimationsModule,
    ChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
