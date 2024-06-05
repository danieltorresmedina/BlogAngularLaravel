<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected  $table = 'usuarios';
    
    // $timestamps = false quita las columnas
    //created_at y updated_at de la sentencia INSERT del metodo save()
    public $timestamps = false;
    
    protected $fillable  = [
        'nombre',
        'apellido',
        'email',
        'password',
        'rol',
        'descripcion',
        'imagen',
        'fecha_creacion',
        'fecha_actualizacion',
        'recordar_Token'
    ];
    
     protected $hidden = [
        'password',
        'recordar_token',
    ];
    
    //Relacion de uno a muchos
    public function publicaciones(){
        return $this->hasMany('App\Models\Publicacion');
    }
}
