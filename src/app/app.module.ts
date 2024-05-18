import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { BaseComponent } from './componentes/base/base.component';
import { BarraAbajoComponent } from './componentes/barra-abajo/barra-abajo.component';
import { TypewriterComponent } from './componentes/typewriter/typewriter.component';


@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    BarraAbajoComponent,
    TypewriterComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
