import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Publicacion } from '../modelos/publicacion';
import { global } from './global';

@Injectable()
export class PublicacionService{
	public url: string;

	constructor(
		private _http: HttpClient
		){
		this.url = global.url;
	}

	uploadImagenPublicacion(token: any, formData: FormData): Observable<any>{
		let formDataPost = formData;

		let headers = new HttpHeaders().set('Authorization', token);

		return this._http.post<FormData>(this.url+'publicacion/upload', formDataPost, {headers : headers});
	}

	crear(token: any, publicacion: Publicacion): Observable<any>{
		//Limpiar campo contenido de la publicacion (editor texto enriquecido) htmlEntities > utf8
		publicacion.contenido = global.htmlEntities(publicacion.contenido);
		let json = JSON.stringify(publicacion);
		let parametros = "json="+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', token);

		return this._http.post(this.url + 'publicacion', parametros, {headers: headers});
	}

	listarPublicaciones(): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this._http.get(this.url + 'publicacion', {headers:headers});
	}

	obtenerPublicacion(id_publicacion: any): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this._http.get(this.url + 'publicacion/' + id_publicacion, {headers:headers});
	}

	actualizarPublicacion(token: any, publicacion: Publicacion, id_publicacion: any): Observable<any>{
		//Limpiar campo contenido de la publicacion (editor texto enriquecido) htmlEntities > utf8
		publicacion.contenido = global.htmlEntities(publicacion.contenido);
		let json = JSON.stringify(publicacion);
		let parametros = "json="+json;

		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Authorization',token);
		return this._http.put(this.url + 'publicacion/' + id_publicacion, parametros, {headers: headers});
	}

	eliminarPublicacion(token: any, id_publicacion: any): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Authorization',token);

		return this._http.delete(this.url + 'publicacion/' + id_publicacion, {headers: headers});
	}

}