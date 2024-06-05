import { Routes } from '@angular/router';

//IMPORTAR COMPONENTES
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { HomeComponent } from './componentes/home/home.component';
import { ErrorComponent } from './componentes/error/error.component';
import { EditarUsuarioComponent } from './componentes/editar-usuario/editar-usuario.component';
import { NuevaCategoriaComponent } from './componentes/nueva-categoria/nueva-categoria.component';
import { NuevaPublicacionComponent } from './componentes/nueva-publicacion/nueva-publicacion.component';
import { DetallePublicacionComponent } from './componentes/detalle-publicacion/detalle-publicacion.component';
import { EditarPublicacionComponent } from './componentes/editar-publicacion/editar-publicacion.component';
import { DetalleCategoriaComponent } from './componentes/detalle-categoria/detalle-categoria.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { IdentidadGuard } from './servicios/identidad.guard';


export const routes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'inicio', component: HomeComponent},
	{path: 'login', component: LoginComponent},
	{path: 'logout/:sure', component: LoginComponent},
	{path: 'registro', component: RegistroComponent},
	{path: 'ajustes', component: EditarUsuarioComponent, canActivate: [IdentidadGuard]},
	{path: 'crear-categoria', component: NuevaCategoriaComponent, canActivate: [IdentidadGuard]},
	{path: 'crear-publicacion', component: NuevaPublicacionComponent, canActivate: [IdentidadGuard]},
	{path: 'publicacion/:id_publicacion', component: DetallePublicacionComponent},
	{path: 'editar-publicacion/:id_publicacion', component: EditarPublicacionComponent, canActivate: [IdentidadGuard]},
	{path: 'categoria/:id_categoria', component: DetalleCategoriaComponent},
	{path: 'perfil/:id_usuario', component: PerfilComponent},
	{path: 'error', component: ErrorComponent},
	{path: '**', component: ErrorComponent}
];
