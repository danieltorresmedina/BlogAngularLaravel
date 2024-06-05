import { Component } from '@angular/core';
import { FormsModule, NgForm  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { CategoriaService } from '../../servicios/categoria.service';
import { Categoria } from '../../modelos/categoria';

@Component({
  selector: 'app-nueva-categoria',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nueva-categoria.component.html',
  styleUrl: './nueva-categoria.component.css',
  providers: [UsuarioService, CategoriaService]
})
export class NuevaCategoriaComponent {
  public page_title: string;
  public identidad: any;
  public token: any;
  public categoria: Categoria;
  public status: any;




  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private _categoriaService: CategoriaService
    ){
    this.page_title = "Crear Nueva Categoria";
    this.identidad = this._usuarioService.obtenerIDentidad();
    this.token = this._usuarioService.obtenerToken();
    this.categoria = new Categoria(1, '');
  }

  onSubmit(form: NgForm){
    this._categoriaService.crear(this.token, this.categoria).subscribe(
      response => {
        if(response.status == 'success'){
          this.categoria = response.categoria;
          this.status = 'success';

          this._router.navigate(['/inicio']);
        }else{
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error)
      }
    );
  }

}
