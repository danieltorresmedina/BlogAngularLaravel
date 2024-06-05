import { Injectable, inject} from '@angular/core';
import { Router, CanActivateFn, CanActivate } from '@angular/router';
import { UsuarioService } from './usuario.service';
import { state } from '@angular/animations';


export const IdentidadGuard: CanActivateFn = (route: any, state: any) => {
	const _usuarioService = inject(UsuarioService);
	const _router = inject(Router);

	let identidad = _usuarioService.obtenerIDentidad();

	if(identidad && identidad.nombre){
			return true;
		}else{
			_router.navigate(['/inicio']);
			return false;
		}

};




