import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Publicacion } from '../../modelos/publicacion';
import { PublicacionService } from '../../servicios/publicacion.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { global } from '../../servicios/global';
import { Usuario } from '../../modelos/usuario';
import { ListadoPublicacionesComponent } from '../listado-publicaciones/listado-publicaciones.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterLink, CommonModule, ListadoPublicacionesComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
  providers: [PublicacionService, UsuarioService]
})
export class PerfilComponent implements OnInit {
  public url: any;
  public publicaciones: Array<Publicacion>;
  public usuario: Usuario;
  public identidad: any;
  public token: any;

  constructor(
    private _publicacionService: PublicacionService,
    private _usuarioService: UsuarioService,
    private _route: ActivatedRoute
    ){
    this.url = global.url;
    this.publicaciones = new Array<Publicacion>;
    this.identidad = this._usuarioService.obtenerIDentidad();
    this.token = this._usuarioService.obtenerToken();
    this.usuario = new Usuario(1,'','','','','','','','');
  }
 
  ngOnInit() {
     this.obtenerPerfil();
  }

 
  obtenerPerfil(){
    //Sacar el id de la publicacion
    this._route.params.subscribe(
      params =>{
        let id_usuario = +params['id_usuario'];
        this.obtenerUsuario(id_usuario);
        this.obtenerPublicaciones(id_usuario);
      });
  }


  obtenerUsuario(id_usuario: any){
    this._usuarioService.obtenerUsuario(id_usuario).subscribe(
      response =>{
        if(response.status == 'success'){
          this.usuario = response.user;

          console.log(this.usuario);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  obtenerPublicaciones(id_usuario: any){
    this._usuarioService.obtenerPublicacionesPorUsuario(id_usuario).subscribe(
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
        this.obtenerPerfil();
      },
      error => {
        console.log(error);
      }
    );
  }

  

}
