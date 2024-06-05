<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Categoria;
use App\Http\Middleware\ApiAuthMiddleware;
use Illuminate\Support\Facades\Validator;

class CategoriaController extends Controller {

    //Obtener todas las caterogias
    public function index() {
        $categorias = Categoria::all();

        return response()->json([
                    'code' => 200,
                    'status' => 'success',
                    'categories' => $categorias
        ]);
    }

    //Buscar una  categoria
    public function show($id) {
        $categoria = Categoria::find($id);

        if (is_object($categoria)) {
            $data = [
                'code' => 200,
                'status' => 'success',
                'category' => $categoria
            ];
        } else {
            $data = [
                'code' => 404,
                'status' => 'error',
                'message' => 'La categoria no existe'
            ];
        }
        return response()->json($data, $data['code']);
    }

    //Guardar nueva categoria
    public function store(Request $request) {
        //Recoger datos por POST
        $json = $request->input('json', null);
        $parametros_array = json_decode($json, true);

        //Comprobamos que los parametros no vengan vacios
        if (!empty($parametros_array)) {

            //Validar los datos
            $validacion = Validator::make($parametros_array, [
                        'nombre' => 'required'
            ]);

            //Guardar la categoria
            if ($validacion->fails()) {
                $data = [
                    'code' => 400,
                    'status' => 'error',
                    'message' => 'No se ha guardado la categoria'
                ];
            } else {
                $categoria = new Categoria();
                $categoria->nombre = $parametros_array['nombre'];
                $categoria->fecha_creacion = now()->format('Y-m-d H:i:s');
                $categoria->save();

                $data = [
                    'code' => 200,
                    'status' => 'success',
                    'category' => $categoria
                ];
            }
        } else {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'No has enviado ninguna categoria'
            ];
        }

        //Devolver resultado
        return response()->json($data, $data['code']);
    }

    //Actualiza una categoria
    public function update($id, Request $request) {
        //Recoger datos por post
        $json = $request->input('json', null);
        $parametros_array = json_decode($json, true);

        if (!empty($parametros_array)) {
            //Validamos datos
            $validacion = Validator::make($parametros_array, [
                        'nombre' => 'required'
            ]);

            //Quitar lo que no quiero actualizar
            unset($parametros_array['id']);
            unset($parametros_array['fecha_creacion']);

            //Actualizar el registro
            $parametros_array['fecha_actualizacion'] = now()->format('Y-m-d H:i:s');
            $categoria = Categoria::where('id', $id)->update($parametros_array);
            
            $data = [
                'code' => 200,
                'status' => 'success',
                'category' => $parametros_array
            ];
            
        } else {
            $data = [
                'code' => 400,
                'status' => 'error',
                'message' => 'No has enviado ninguna categoria'
            ];
        }
        return response()->json($data, $data['code']);
    }

}
