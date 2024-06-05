import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'listado-publicaciones',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './listado-publicaciones.component.html',
  styleUrl: './listado-publicaciones.component.css'
})
export class ListadoPublicacionesComponent {



  @Input() publicaciones: any;
  @Input() identidad: any;
  @Input() url: any
  @Output() borrarPublicacion = new EventEmitter();

  quitarPublicacion(id: any){
    this.borrarPublicacion.emit(id);
  }


}
