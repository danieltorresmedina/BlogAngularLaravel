import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';



import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent} from './componentes/registro/registro.component';
import { UsuarioService } from './servicios/usuario.service';
import { IdentidadGuard } from  './servicios/identidad.guard';


import { CommonModule } from '@angular/common';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
        ],
  imports: [
    BrowserModule,
    CommonModule,
    LoginComponent,
    RegistroComponent,
    FormsModule,
    HttpClientModule,
    UsuarioService,
    RouterModule  ],
  providers: [
    appRoutingProviders,
    UsuarioService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
