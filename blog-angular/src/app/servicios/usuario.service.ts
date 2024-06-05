import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Usuario} from '../modelos/usuario';
import {global} from './global';



@Injectable({
	providedIn : 'root'
})
export class UsuarioService{
	public url: string;
	public identidad: any;
	public token: any;


	constructor(
		public _http: HttpClient
		){
		this.url = global.url;
		this.identidad = new Object();
		this.token =  new Object();

	}

	test(){
		return "Hola mundo desde un servicio!!";
		}

	registrar(usuario: Usuario): Observable<any>{
		let json = JSON.stringify(usuario);
		let parametros = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

		return this._http.post(this.url+'registro', parametros, {headers: headers});
	}

	autenticar(usuario : Usuario, gettoken: null | boolean = null): Observable<any>{
		if(gettoken != null){
			usuario.gettoken = 'true';
		}

		let json = JSON.stringify(usuario);
		let parametros = 'json='+json;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

		return this._http.post(this.url+'login', parametros, {headers: headers});
	}

	actualizar(token : any, usuario : Usuario): Observable<any>{
		//Limpiar campo descripcion del usuario (editor texto enriquecido) htmlEntities > utf8
		usuario.descripcion = global.htmlEntities(usuario.descripcion);
		let json = JSON.stringify(usuario);
		let parametros = 'json='+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', token);
		return this._http.put(this.url + 'usuario/actualizar', parametros, {headers: headers});
	}

	obtenerIDentidad(){
		let identidad = JSON.parse(localStorage.getItem('identidad') || '{}');

		if(identidad && identidad != "undefined"){
			this.identidad = identidad;
		}else{
			this.identidad = null;
		}

		return this.identidad;
	}

	obtenerToken(){
		let token = localStorage.getItem('token');

		if(token && token != "undefined"){
			this.token = token;
		}else{
			this.token = null;
		}
		return this.token;
	}

	uploadAvatar(token: any ,formData: FormData): Observable<any>{
		let formDataPost = formData

		let headers = new HttpHeaders().set('Authorization', token);

		return this._http.post<FormData>(this.url+'usuario/upload', formDataPost, {headers: headers});
	}

	obtenerPublicacionesPorUsuario(id: any): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this._http.get(this.url + 'publicacion/usuario/' + id, {headers: headers});
	}

	obtenerUsuario(id: any): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this._http.get(this.url + 'usuario/perfil/' + id, {headers: headers});
	}
	

}

