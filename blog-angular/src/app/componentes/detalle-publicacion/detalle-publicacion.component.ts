import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { Publicacion } from '../../modelos/publicacion';
import { PublicacionService } from '../../servicios/publicacion.service';

@Component({
  selector: 'app-detalle-publicacion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-publicacion.component.html',
  styleUrl: './detalle-publicacion.component.css',
  providers: [PublicacionService]
})
export class DetallePublicacionComponent implements OnInit{

  public publicacion: any;

  constructor(
    private _publicacionService: PublicacionService,
    private _route: ActivatedRoute,
    private _router: Router,
    ){
  }

  ngOnInit(){
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
              console.log(response);
              console.log(this.publicacion);
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

}
