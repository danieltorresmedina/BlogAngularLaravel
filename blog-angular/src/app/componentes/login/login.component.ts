import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm  } from '@angular/forms';
import { Usuario } from '../../modelos/usuario';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../servicios/usuario.service';
import { Router, ActivatedRoute, Params } from '@angular/router' ;

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [UsuarioService]
})
export class LoginComponent implements OnInit {
  public page_title: string;
  public usuario: Usuario;
  public status: string;
  public token: any;
  public identidad: any;

  constructor(
    private _usuarioService: UsuarioService,
    private _router: Router,
    private _route: ActivatedRoute
    ){
    this.page_title = 'Identificate';
    this.usuario = new Usuario(1, '','','','','ROL_USUARIO','','','');
    this.status = '';
    
  }

  ngOnInit(){

    //Se ejecuta siempre y cierra sesion solo cuando recibe el parametro :sure por URL
    this.logout();

  }

  onSubmit(form: NgForm){
    this._usuarioService.autenticar(this.usuario).subscribe(
      response => {
        //TOKEN
        if(response.status != 'error'){
          this.status = 'success';
          this.token = response;

          //OBJETO USUARIO IDENTIFICADO
          this._usuarioService.autenticar(this.usuario, true).subscribe(
                response => {
                    this.identidad = response;
                    console.log(this.token);
                    console.log(this.identidad);

                    //Persistir datos usuario identificado
                    localStorage.setItem('token', this.token);
                    localStorage.setItem('identidad', JSON.stringify(this.identidad));

                    //Redireccion a inicio
                    this._router.navigate(['inicio']);
                },
                error => {
                    this.status = 'error';
                    console.log(<any>error);
                }
              );

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

  logout(){
    this._route.params.subscribe(
      params => {
      let logout = +params['sure'];

      if(logout == 1){
        localStorage.removeItem('identidad');
        localStorage.removeItem('token');

        this.identidad = null;
        this.token = null;

        //Redireccion a inicio
        this._router.navigate(['inicio']);
      }

    });
  }

}
