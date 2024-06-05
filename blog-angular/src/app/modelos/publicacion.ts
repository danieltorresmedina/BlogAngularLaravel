export class Publicacion{
	constructor(
		public id: number,
		public id_usuario: number,
		public id_categoria: number,
		public titulo: string,
		public contenido: string,
		public imagen: string
		){
		
	}
}