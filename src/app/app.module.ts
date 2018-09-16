import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RatesComponent } from './rates.component';
import { DateValueAccessorDirective } from './date-accessor.directive';
import { ExchangeRateService } from './exchange-rate.service';


@NgModule({
  imports:      [ BrowserModule, FormsModule, CommonModule, HttpClientModule ],
  declarations: [ AppComponent, RatesComponent, DateValueAccessorDirective ],
  bootstrap:    [ AppComponent ],
  providers: [ ExchangeRateService ]
})
export class AppModule { }
