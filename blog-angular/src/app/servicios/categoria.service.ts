import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Categoria} from '../modelos/categoria';
import {global} from './global';


@Injectable()
export class CategoriaService{
	public url: string;
	
	constructor(
		private _http: HttpClient
		){
		this.url = global.url;
	}

	crear(token: any, categoria: Categoria): Observable<any>{
		let json = JSON.stringify(categoria);
		let parametros = "json="+json;

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization',token);

		return this._http.post(this.url + 'categoria', parametros, {headers: headers});
	}

	listarCategorias(): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this._http.get(this.url + 'categoria', {headers: headers});
	}

	obtenerCategoria(id: any): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this._http.get(this.url + 'categoria/' + id, {headers: headers});
	}

	obtenerPublicacionesPorCategoria(id: any): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this._http.get(this.url + 'publicacion/categoria/' + id, {headers: headers});
	}

	


}