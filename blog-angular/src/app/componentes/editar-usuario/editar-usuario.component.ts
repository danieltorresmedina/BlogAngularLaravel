import { Component } from '@angular/core';
import { FormsModule, NgForm  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';


import { Usuario } from '../../modelos/usuario';
import { UsuarioService } from '../../servicios/usuario.service';
import { global } from '../../servicios/global';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, FroalaEditorModule],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.css',
  providers: [UsuarioService]
})
export class EditarUsuarioComponent {

  public page_title: string;
  public usuario: Usuario;
  public identidad: any;
  public token: any;
  public status: any;
  public archivo: any;
  public url: any;
  public opciones_froala: Object = {
      charCounterCount: true,
      toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
      toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
      toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
      toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
  };
  


  constructor(
    private _usuarioService: UsuarioService
    ){
    this.page_title = 'Ajustes de usuario';
    this.usuario = new Usuario(1, '','','','','ROL_USUARIO','','','');
    this.identidad = this._usuarioService.obtenerIDentidad();
    this.token = this._usuarioService.obtenerToken();
    this.url = global.url;

    // Rellenar objeto usuario
    this.usuario = new Usuario(
      this.identidad.sub,
      this.identidad.nombre,
      this.identidad.apellido,
      this.identidad.email,
      this.identidad.password,
      this.identidad.rol,
      this.identidad.descripcion,
      this.identidad.imagen,
      this.identidad.gettoken);
  }

  onSubmit(form: NgForm){
    this._usuarioService.actualizar(this.token, this.usuario).subscribe(
        response => {
          if(response && response.status){
            console.log(response);
            this.status = 'success';

            //Actualizar Usuario en sesion
            if(response.changes.nombre){
              this.usuario.nombre = response.changes.nombre;
            }

            if(response.changes.apellido){
              this.usuario.apellido = response.changes.apellido;
            }

            if(response.changes.email){
              this.usuario.email = response.changes.email;
            }

            if(response.changes.descripcion){
              this.usuario.descripcion = response.changes.descripcion;
            }

            if(response.changes.imagen){
              this.usuario.imagen = response.changes.imagen;
            }

            this.identidad = this.usuario;
            localStorage.setItem('identidad', JSON.stringify(this.identidad));

          }else{
            this.status = 'error';
          }
        },
        error => {
          this.status = 'error';
          console.log(<any>error);
        }
      );
  }

  //Cargar Avatarr
  cargarAvatar(evento: Event){
    //Obtenemos el elemento input a traves del evento
    const target = evento.target as HTMLInputElement;

    //Si existe target y si existe archivo, asignar el valor a variable file
    if(target && target.files){
      var file = target.files[0];

      //Si file existe crear un formData, asignar asignar valor file0 y contenido de file
        if(file){
        this.archivo = file.name;

        var formData = new FormData();

        formData.append("file0", file);

        this._usuarioService.uploadAvatar(this.token ,formData).subscribe(
          response => {
            console.log(response);
            this.usuario.imagen = response.imagen;
          },
          error => {
            console.log(<any>error);
          }
        );


      }

    }
    

  }


}
