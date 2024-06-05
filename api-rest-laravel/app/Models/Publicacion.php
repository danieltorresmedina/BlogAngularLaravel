<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Publicacion extends Model
{
    protected $table = 'publicaciones';
    
    // $timestamps = false quita las columnas
    //created_at y updated_at de la sentencia INSERT del metodo save()
    public $timestamps = false;
    
    protected $fillable = [
        'id_usuario',
        'id_categoria',
        'titulo',
        'contenido',
        'imagen',
        'fecha_actualizacion'
    ];


    //Relacion de uno a muchos inversa (muchos a uno)
    public function usuario(){
        return $this->belongsTo('App\Models\Usuario', 'id_usuario');
    }
    
    public function categoria(){
        return $this->belongsTo('App\Models\Categoria', 'id_categoria');
    }
    
   
}
