import { Component, OnInit, DoCheck } from '@angular/core';
import { RouterOutlet, RouterLink, RouterModule  } from '@angular/router';
import { FormsModule, NgForm  } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { global } from './servicios/global';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioService } from './servicios/usuario.service';
import { CategoriaService } from './servicios/categoria.service';
import { IdentidadGuard } from  './servicios/identidad.guard';





@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,LoginComponent, RegistroComponent, RouterLink, HttpClientModule, RouterModule, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [UsuarioService, CategoriaService]
})
export class AppComponent implements OnInit, DoCheck{
  public title = 'Blog Angular Daniel';
  public identidad: any;
  public token: any;
  public url: any;
  public categorias: any;

  constructor(
    public _usuarioService: UsuarioService,
    public _categoriaService: CategoriaService
    ){
    this.cargarUsuario();
    this.url = global.url;
  }

  ngOnInit(){
    console.log("Webapp cargada correctamente");
    this.obtenerCategorias();
    console.log(typeof this._usuarioService.obtenerIDentidad());
  }

  ngDoCheck(){
    this.cargarUsuario();
  }

  cargarUsuario(){
    this.identidad = this._usuarioService.obtenerIDentidad();
    this.token = this._usuarioService.obtenerToken();
  }

  obtenerCategorias(){
    this._categoriaService.listarCategorias().subscribe(
      response => {
        if(response.status == 'success'){
          this.categorias = response.categories;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
