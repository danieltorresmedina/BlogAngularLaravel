import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm  } from '@angular/forms';
import { Usuario } from '../../modelos/usuario';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../servicios/usuario.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'registro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  providers: [UsuarioService]
})
export class RegistroComponent implements OnInit{
  public page_title: string;
  public usuario: Usuario;
  public status: string;

  constructor(
    private _usuarioService: UsuarioService
    ){
    this.page_title = 'Registrate';
    this.usuario = new Usuario(1, '','','','','ROL_USUARIO','','','');
    this.status = '';
    
  }

  ngOnInit(){
    console.log('Componente de registro lanzado');
    console.log(this._usuarioService.test());
  }

  onSubmit(form: NgForm ){
    
    this._usuarioService.registrar(this.usuario).subscribe(
      response => {

        if(response.status == "success"){
          this.status = response.status;
          form.reset();

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

}
