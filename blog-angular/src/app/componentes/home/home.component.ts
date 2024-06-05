import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { Publicacion } from '../../modelos/publicacion';
import { PublicacionService } from '../../servicios/publicacion.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { global } from '../../servicios/global';
import { ListadoPublicacionesComponent } from '../listado-publicaciones/listado-publicaciones.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterModule, CommonModule, ListadoPublicacionesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [PublicacionService, UsuarioService]
})
export class HomeComponent implements OnInit{
  public page_title: string;
  public url: any;
  public publicaciones: Array<Publicacion>;
  public identidad: any;
  public token: any;

  constructor(
    private _publicacionService: PublicacionService,
    private _usuarioService: UsuarioService
    ){
    this.page_title = 'Inicio';
    this.url = global.url;
    this.publicaciones = new Array<Publicacion>;
    this.identidad = this._usuarioService.obtenerIDentidad();
    this.token = this._usuarioService.obtenerToken();
  }

  ngOnInit(){
    this.obtenerPublicaciones();
  }

  obtenerPublicaciones(){
    this._publicacionService.listarPublicaciones().subscribe(
      response => {
        if(response.status = 'success'){
          this.publicaciones = response.posts;
          console.log(this.publicaciones);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  borrarPublicacion(id: any){
    this._publicacionService.eliminarPublicacion(this.token, id).subscribe(
      response => {
        this.obtenerPublicaciones();
      },
      error => {
        console.log(error);
      }
    );
  }

}
