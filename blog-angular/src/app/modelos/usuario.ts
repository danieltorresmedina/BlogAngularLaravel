export class Usuario{
	constructor(
		public id: number,
		public nombre: string,
		public apellido: string,
		public email: string,
		public password: string,
		public rol: string,
		public descripcion: string,
		public imagen: string,
		public gettoken: string
		){
		
	}
}