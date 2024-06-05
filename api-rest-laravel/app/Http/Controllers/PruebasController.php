<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Publicacion;
use App\Models\Categoria;
use App\Models\Usuario;

class PruebasController extends Controller {

    public function index() {
        $titulo = 'Animales';
        $animales = ['Perro', 'Gato', 'Tigre'];

        return view('pruebas.index', array(
            'titulo' => $titulo,
            'animales' => $animales));
    }

    public function testOrm() {

        
        
         // $publicaciones = Publicacion::all();
         // foreach($publicaciones as $publicacion){
         // echo "<h1>".$publicacion->titulo."</h1>";
         // echo "<span style='background-color:red;'>{$publicacion->usuario->nombre} - {$publicacion->categoria->nombre}</span>";
         // echo "<p>".$publicacion->contenido."</p>";
         // echo '<hr>';
         // }
         
         
        $categorias = Categoria::all();
        foreach ($categorias as $categoria) {
            echo "<h1>{$categoria->nombre}</h1>";
               
            foreach ($categoria->publicaciones as $publicacion) {
                echo "<h3>" . $publicacion->titulo . "</h3>";
                echo "<span style='background-color:red;'>{$publicacion->usuario->nombre} - {$publicacion->categoria->nombre}</span>";
                echo "<p>" . $publicacion->contenido . "</p>";
            }
            echo '<hr>';
        }

        die();
    }

}
