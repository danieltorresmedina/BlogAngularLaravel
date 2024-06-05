<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Publicacion;
use App\Helpers\JwtAuth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class PublicacionController extends Controller {

    //Listar publicaciones
    public function index() {
        $publicaciones = Publicacion::all()->Load('categoria');

        return response()->json([
                    'code' => 200,
                    'status' => 'success',
                    'posts' => $publicaciones
                        ], 200);
    }

    //Buscar una publicacion
    public function show($id) {
        $publicacion = Publicacion::find($id)->Load('categoria')->Load('usuario');

        if (is_object($publicacion)) {
            $data = [
                'code' => 200,
                'status' => 'success',
                'post' => $publicacion
            ];
        } else {
            $data = [
                'code' => 404,
                'status' => 'error',
                'message' => 'La publicacion no existe'
            ];
        }
        return response()->json($data, $data['code']);
    }

    //Guardar una nueva publicacion
    public function store(Request $request) {
        //Recoger datos por POST
        $json = $request->input('json', null);
        $parametros = json_decode($json);
        $parametros_array = json_decode($json, true);

        if (!empty($parametros_array)) {
            //Conseguir usuario autenticado.
            $usuario = $this->obtenerIdentidad($request);

            //Validar datos
            $validacion = Validator::make($parametros_array, [
                        'titulo' => 'required',
                        'contenido' => 'required',
                        'id_categoria' => 'required',
                        'imagen' => 'required'
            ]);

            if ($validacion->fails()) {
                $data = [
                    'code' => 400,
                    'status' => 'error',
                    'message' => 'No se ha guardado la publicacion, faltan datos'
                ];
            } else {
                //Guardar la publicacion
                $publicacion = new Publicacion();
                $publicacion->id_usuario = $usuario->sub;
                $publicacion->id_categoria = $parametros->id_categoria;
                $publicacion->titulo = $parametros->titulo;
                $publicacion->contenido = $parametros->contenido;
                $publicacion->imagen = $parametros->imagen;
                $publicacion->fecha_creacion = now()->format('Y-m-d H:i:s');
                $publicacion->save();

                $data = [
                    'code' => 200,
                    'status' => 'success',
                    'post' => $publicacion
                ];
            }
        } else {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'Envia los datos correctamente'
            ];
        }
        //Devolver la respuesta
        return response()->json($data, $data['code']);
    }

    //Actualizar una publicacion
    public function update($id, Request $request) {
        //Recoger datos por POST
        $json = $request->input('json', null);
        $parametros_array = json_decode($json, true);

        if (!empty($parametros_array)) {
            //Validar datos
            $validacion = Validator::make($parametros_array, [
                        'titulo' => 'required',
                        'contenido' => 'required',
                        'id_categoria' => 'required'
            ]);

            if ($validacion->fails()) {
                $data['errors'] = $validacion->errors();
                return response()->json($data, $data['code']);
            }

            //Eliminar lo que no queremos actualizar
            unset($parametros_array['id']);
            unset($parametros_array['id_usuario']);
            unset($parametros_array['fecha_creacion']);
            unset($parametros_array['usuario']);

            //Conseguir usuario autenticado.
            $usuario = $this->obtenerIdentidad($request);

            //buscar el registro
            $publicacion = Publicacion::where('id', $id)->where('id_usuario', $usuario->sub)->first();

            if (!empty($publicacion) && is_object($publicacion)) {
                //Actualizar registro
                $parametros_array['fecha_actualizacion'] = now()->format('Y-m-d H:i:s');
                $publicacion->update($parametros_array);



                //Devolver algo
                $data = array(
                    'code' => 200,
                    'status' => 'success',
                    'post' => $publicacion,
                    'changes' => $parametros_array
                );
            } else {
                //Error si el usuario no es dueño de la publicacion
                $data = array(
                    'code' => 400,
                    'status' => 'error',
                    'message' => 'La publicacion no existe o no eres el dueño de la publicacion'
                );
            }
        } else {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'Envia los datos correctamente'
            ];
        }
        return response()->json($data, $data['code']);
    }

    //Eliminar una publicacion
    public function destroy($id, Request $request) {
        //Conseguir usuario autenticado.
        $usuario = $this->obtenerIdentidad($request);

        //obtener el registro
        $publicacion = Publicacion::where('id', $id)->where('id_usuario', $usuario->sub)->first();

        if (!empty($publicacion)) {

            //Borrarlo
            $publicacion->delete();

            //Devolver algo
            $data = [
                'code' => 200,
                'status' => 'success',
                'post' => $publicacion
            ];
        } else {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'La publicacion que intenta borrar no existe'
            ];
        }

        return response()->json($data, $data['code']);
    }

    //Comrpobar que el usuario este logeado o identificado
    private function obtenerIdentidad($request) {
        //Conseguir usuario autenticado.
        $jwtAuth = new JwtAuth();
        $token = $request->header('Authorization', null);
        $usuario = $jwtAuth->checkToken($token, true);

        return $usuario;
    }

    //Subir una imagen a la publicacion
    public function upload(Request $request) {
        //Recoger imagen de la peticion
        $imagen = $request->file('file0');

        //Validar imagen
        $validacion = Validator::make($request->all(), [
                    'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);

        //Guardar imagen
        if (!$imagen || $validacion->fails()) {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'Error al subir imagen'
            ];
        } else {
            $nombreImagen = time() . $imagen->getClientOriginalName();

            Storage::disk('imagenes')->put($nombreImagen, File::get($imagen));

            $data = [
                'code' => 200,
                'status' => 'success',
                'image' => $nombreImagen
            ];
        }

        //Devolver respuesta
        return response()->json($data, $data['code']);
    }

    //Visualizar la imagen
    public function obtenerImagen($filename) {
        //Comprobar si existe el ficheo
        $isset = Storage::disk('imagenes')->exists($filename);

        if ($isset) {
            //Conseguir la imagen
            $file = Storage::disk('imagenes')->get($filename);

            //Devolver la imagen
            return new Response($file, 200);
        } else {
            //Mostrar el posible error
            $data = [
                'code' => 404,
                'status' => 'error',
                'message' => 'La imagen no existe'
            ];
        }
        return response()->json($data,$data['code']);
    }
    
    //obtener publicaciones por categoria
    public function obtenerPublicacionesPorCategoria($id){
        $publicaciones = Publicacion::where('id_categoria', $id)->get();
        
        return response()->json([
            'status' => 'success',
            'posts' => $publicaciones
        ],200);
    }
    
    //obtener publicaciones por usuario
    public function obtenerPublicacionesPorUsuario($id){
        $publicaciones = Publicacion::where('id_usuario', $id)->get();
        
        return response()->json([
            'status' => 'success',
            'posts' => $publicaciones
        ],200);
    }

}
