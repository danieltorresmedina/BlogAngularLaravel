<?php

use Illuminate\Support\Facades\Route;

//Cargando clases
use App\Http\Middleware\ApiAuthMiddleware;

 //Rutas de prueba 
Route::get('/', function () {
    return 'Hola Mundo con Laravel TEST';
});


Route::get('/welcome', function () {
    return view('welcome');
});

Route::get('/pruebas/{nombre?}', function($nombre = null){
    
    $texto = '<h1>Texto desde una ruta </h1>';
    $texto .= 'Nombre: '.$nombre;
    
    return view('pruebas', array('texto' => $texto));
});

Route::get('/animales',[App\Http\Controllers\PruebasController::class,'index']);

Route::get('/test-orm',[App\Http\Controllers\PruebasController::class,'testOrm']);

/**
 * Rutas del api
 * /**
 * Metodos HTTP comunes
 *
 * GET: Conseguir datos o recursos
 * POST: Guardar datos o recursos o hacer logica desde un formulario
 * PUT: Actualizar datos o recursos
 * DELETE: Eliminar datos o recursos
 */


//Rutas de prueba
//Route::get('/usuario/pruebas',[App\Http\Controllers\UsuarioController::class,'pruebas']);
//Route::get('/categoria/pruebas',[App\Http\Controllers\CategoriaController::class,'pruebas']);
//Route::get('/publicacion/pruebas',[App\Http\Controllers\PublicacionController::class,'pruebas']);

//Rutas del controlador de usuarios
//Para hacer funcionar el metodo POST comentar linea \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class
//Del archivo api-laravel\vendor\laravel\framework\src\Illuminate\Foundation\Configuration\Middleware.php
Route::post('/api/registro',[App\Http\Controllers\UsuarioController::class,'registrar']);
Route::post('/api/login',[App\Http\Controllers\UsuarioController::class,'login']);
Route::put('/api/usuario/actualizar', [App\Http\Controllers\UsuarioController::class,'update']);
Route::post('/api/usuario/upload', [App\Http\Controllers\UsuarioController::class,'upload'])->middleware(\App\Http\Middleware\ApiAuthMiddleware::class);
Route::get('/api/usuario/avatar/{filename}', [App\Http\Controllers\UsuarioController::class,'getImagen']);
Route::get('/api/usuario/perfil/{id}',[App\Http\Controllers\UsuarioController::class,'profile']);

//Rutas del controlador de categoria
Route::resource('/api/categoria','App\Http\Controllers\CategoriaController')->middleware(\App\Http\Middleware\ApiAuthMiddleware::class)->except(['index','show']);
Route::get('/api/categoria',[App\Http\Controllers\CategoriaController::class,'index']);
Route::get('/api/categoria/{id}',[App\Http\Controllers\CategoriaController::class,'show']);

//Rutas del controlador de publicaciones
Route::resource('/api/publicacion', 'App\Http\Controllers\PublicacionController')->middleware(\App\Http\Middleware\ApiAuthMiddleware::class)->except(['index','show']);
Route::get('/api/publicacion', [App\Http\Controllers\PublicacionController::class,'index']); 
Route::get('/api/publicacion/{id}', [App\Http\Controllers\PublicacionController::class,'show']);
Route::post('/api/publicacion/upload', [App\Http\Controllers\PublicacionController::class,'upload'])->middleware(\App\Http\Middleware\ApiAuthMiddleware::class);
Route::get('/api/publicacion/imagen/{filename}',[App\Http\Controllers\PublicacionController::class,'obtenerImagen']);
Route::get('/api/publicacion/categoria/{id}', [App\Http\Controllers\PublicacionController::class,'obtenerPublicacionesPorCategoria']);
Route::get('/api/publicacion/usuario/{id}', [App\Http\Controllers\PublicacionController::class,'obtenerPublicacionesPorUsuario']);

        





