import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { Categoria } from '../../modelos/categoria';
import { CategoriaService } from '../../servicios/categoria.service';
import { PublicacionService } from '../../servicios/publicacion.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { global } from '../../servicios/global';
import { ListadoPublicacionesComponent } from '../listado-publicaciones/listado-publicaciones.component';

@Component({
  selector: 'app-detalle-categoria',
  standalone: true,
  imports: [CommonModule, RouterLink, ListadoPublicacionesComponent],
  templateUrl: './detalle-categoria.component.html',
  styleUrl: './detalle-categoria.component.css',
  providers: [CategoriaService, PublicacionService, UsuarioService]
})
export class DetalleCategoriaComponent implements OnInit{
  public page_title: string;
  public categoria: Categoria;
  public publicaciones: any;
  public url: string;
  public token: any;
  public identidad: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _categoriaService: CategoriaService,
    private _publicacionService: PublicacionService,
    private _usuarioService: UsuarioService
    ){
    this.url = global.url;
    this.page_title = 'Categoria';
    this.categoria = new Categoria(1,'');
    this.token = _usuarioService.obtenerToken();
    this.identidad = this._usuarioService.obtenerIDentidad();
  }

  ngOnInit(){
    this.leerPublicacionesPorCategoria();
  }

  leerPublicacionesPorCategoria(){
    this._route.params.subscribe(
      params =>{
        let id = +params['id_categoria'];

        this._categoriaService.obtenerCategoria(id).subscribe(
          response => {
            if(response.status == 'success'){
              this.categoria = response.category;

              this._categoriaService.obtenerPublicacionesPorCategoria(id).subscribe(
                response => {
                  if(response.status == 'success'){
                    this.publicaciones = response.posts;
                  }else{
                    this._router.navigate(['/inicio']);
                  }
                },
                error => {
                  console.log(error);
                }
              );
            }else{
              this._router.navigate(['/inicio']);
            }
          },
          error => {
            console.log(error);
          }
        );
    });
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

}
