<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table = 'categorias';
    
    // $timestamps = false quita las columnas
    //created_at y updated_at de la sentencia INSERT del metodo save()
    public $timestamps = false;
    
    
    //Relacion de uno a muchos
    public function publicaciones(){
        return $this->hasMany('App\Models\Publicacion','id_categoria');
        
    }
    
}
