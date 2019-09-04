import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ConfigPainelComponent } from './config-painel/config-painel.component';
import { SliderModule } from 'primeng/slider';
import {ChartModule} from 'primeng/chart';
import {TableModule} from 'primeng/table';
import {AccordionModule} from 'primeng/accordion';


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
    ChartModule,
    TableModule,
    AccordionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
