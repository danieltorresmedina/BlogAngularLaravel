import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FroalaEditorModule } from 'angular-froala-wysiwyg';
import { UsuarioService } from '../../servicios/usuario.service';
import { CategoriaService } from '../../servicios/categoria.service';
import { PublicacionService } from '../../servicios/publicacion.service';
import { Publicacion } from '../../modelos/publicacion';
import { global } from '../../servicios/global';



@Component({
  selector: 'app-editar-publicacion',
  standalone: true,
  imports: [FormsModule, CommonModule, FroalaEditorModule],
  templateUrl: '../nueva-publicacion/nueva-publicacion.component.html',
  providers:[UsuarioService, CategoriaService, PublicacionService]
})
export class EditarPublicacionComponent implements OnInit{

  public page_title: string;
  public url: any;
  public identidad: any;
  public token: any;
  public publicacion: Publicacion;
  public categorias: any;
  public status: any;
  public is_editar: boolean;
  public opciones_froala: Object = {
      charCounterCount: true,
      language: 'es',
      toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
      toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
      toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
      toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private _categoriaService: CategoriaService,
    private _publicacionService: PublicacionService
    ){
    this.page_title = 'Editar Publicacion';
    this.url = global.url;
    this.identidad = this._usuarioService.obtenerIDentidad();
    this.token = this._usuarioService.obtenerToken();
    this.publicacion = new Publicacion(1, this.identidad.sub, 1,'', '', '');
    this.is_editar = true;
  }

  ngOnInit(){
    this.obtenerCategorias();
    this.leerPublicacion();
  }

  leerPublicacion(){
    //Sacar el id de la publicacion
    this._route.params.subscribe(
      params =>{
        let id_publicacion = +params['id_publicacion'];

        //Peticion ajax para sacar los datos de la publicacion
        this._publicacionService.obtenerPublicacion(id_publicacion).subscribe(
          response => {
            if(response.status == 'success'){
              this.publicacion = response.post;

              if(this.publicacion.id_usuario != this.identidad.sub){
                this._router.navigate(['inicio']);
              }
              
            }
          },
          error => {
            console.log(error);
            this._router.navigate(['inicio']);
          }
        );
      }
    );
    
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

  onSubmit(form: NgForm){
    this._publicacionService.actualizarPublicacion(this.token, this.publicacion, this.publicacion.id).subscribe(
      response => {
        if(response.status == 'success'){
          this.status = 'success';
          //this.publicacion = response.publicacion;
          //redirigir a la pagina de la publicacion
          this._router.navigate(['/publicacion', this.publicacion.id]);
        }else{
          this.status = 'error';
        }
      },
      error => {
        console.log(error);
        this.status = 'error';
      }
    );
  }

  cargarImagenPublicacion(evento: Event){
    //Obtenemos el elemento input a traves del evento
    const target = evento.target as HTMLInputElement;

    //Si existe target y si existe archivo, asignar el valor a variable file
    if(target && target.files){
      var file = target.files[0];

      //Si file existe crear un formData, asignar asignar valor file0 y contenido de file
        if(file){

        var formData = new FormData();

        formData.append("file0", file);

        this._publicacionService.uploadImagenPublicacion(this.token ,formData).subscribe(
          response => {
            this.publicacion.imagen = response.image;
          },
          error => {
            console.log(<any>error);
          }
        );


      }

    }
  }

}
