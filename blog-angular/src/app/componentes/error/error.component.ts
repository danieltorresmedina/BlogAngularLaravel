import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {
  public page_title: string;

  constructor(){
    this.page_title = 'Pagina no encontrada';
  }

}
