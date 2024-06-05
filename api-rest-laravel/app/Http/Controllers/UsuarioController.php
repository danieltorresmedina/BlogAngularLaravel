<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use App\Models\Usuario;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class UsuarioController extends Controller {

 

    public function registrar(Request $request) {

        //Recoger datos del usuario por POST
        $json = $request->input('json', null);
        $parametros = json_decode($json); //objeto
        $parametros_array = json_decode($json, true); //array

        if (!empty($parametros) && !empty($parametros_array)) {
            //Limpiar datos
            $parametros_array = array_map('trim', $parametros_array);

            //Validar datos 
            $validar = Validator::make($parametros_array, [
                        'nombre' => 'required|alpha',
                        'apellido' => 'required|alpha',
                        'email' => 'required||email|unique:usuarios',
                        'password' => 'required|'
            ]);

            if ($validar->fails()) {
                //Validacion ha fallado
                $datos = array(
                    'status' => 'error',
                    'code' => '404',
                    'message' => 'El usuario no se ha creado',
                    'errors' => $validar->errors()
                );
            } else {
                //Validacion correcta
                //Cifrar contraseña
                $passwordCifrada = hash('sha256', $parametros->password);

                //Crear Usuario 
                $usuario = new Usuario();
                $usuario->nombre = $parametros_array['nombre'];
                $usuario->apellido = $parametros_array['apellido'];
                $usuario->email = $parametros_array['email'];
                $usuario->password = $passwordCifrada;
                $usuario->rol = 'ROL_USUARIO';
                $usuario->fecha_creacion = now()->format('Y-m-d H:i:s');

                //Guardar el usuario                               
                $usuario->save();

                $datos = array(
                    'status' => 'success',
                    'code' => '200',
                    'message' => 'El usuario  se ha creado correctamente',
                    'user' => $usuario
                );
            }
        } else {
            //Envio incorrecto de los datos
            $datos = array(
                'status' => 'success',
                'code' => '404',
                'message' => 'Los datos enviados no son correctos'
            );
        }

        return response()->json($datos, $datos['code']);
    }

    public function login(Request $request) {

        $jwtAuth = new \JwtAuth();

        //Recibir datos por POST
        $json = $request->input('json', null);
        $parametros = json_decode($json);
        $parametros_array = json_decode($json, true);

        //Validar esos datos
        $validar = Validator::make($parametros_array, [
                    'email' => 'required||email',
                    'password' => 'required'
        ]);

        if ($validar->fails()) {
            //Validacion ha fallado
            $signup = array(
                'status' => 'error',
                'code' => '404',
                'message' => 'El usuario no se ha podido identificar',
                'errors' => $validar->errors()
            );
        } else {
            //Cifrar la password
            $pwd = hash('sha256', $parametros->password);

            //Devolver token o datos
            $signup = $jwtAuth->singup($parametros->email, $pwd);

            if (!empty($parametros->gettoken)) {
                $signup = $jwtAuth->singup($parametros->email, $pwd, true);
            }
        }

        return response()->json($signup, 200);
    }

    public function update(Request $request) {

        //Comprobar si el usuario está identificado
        $token = $request->header('Authorization');
        $jwtAuth = new \JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);

        //Recoger datos por post
        $json = $request->input('json', null);
        $parametros_array = json_decode($json, true);

        if ($checkToken && !empty($parametros_array)) {

            //Obtener usuario identificado
            $usuario = $jwtAuth->checkToken($token, true);

            //validar datos-minimo debe contener los siguientes datos
            $validar = Validator::make($parametros_array, [
                        'nombre' => 'required|alpha',
                        'apellido' => 'required|alpha',
                        'email' => 'required||email|unique:usuarios,' . $usuario->sub
            ]);

            //quitar campos que no quiero actualizar(aunque vengan en la peticion no se actualizaran)
            unset($parametros_array['id']);
            unset($parametros_array['rol']);
            unset($parametros_array['password']);
            unset($parametros_array['fecha_creacion']);
            unset($parametros_array['recordar_token']);

            //Agregarle fecha de actualizacion al registro
            $parametros_array['fecha_actualizacion'] = now()->format('Y-m-d H:i:s');

            //actualizar usuarios en bbdd
            $usuario_actualizacion = Usuario::where('id', $usuario->sub)->update($parametros_array);

            //devolver resultado en array
            $data = array(
                'code' => 200,
                'status' => 'success',
                'user' => $usuario,
                'changes' => $parametros_array
            );
        } else {
            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'El usuario no está identificado'
            );
        }

        return response()->json($data, $data['code']);
    }

    //Cargar avatar al sistema
    public function upload(request $request) {
        //Recoger datos de la peticion
        $imagen = $request->file('file0');

        //Validacion de imagen
        $validacionImagen = Validator::make($request->all(), [
                    'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);

        //Subir y guardar imagen
        if (!$imagen || $validacionImagen->fails()) {

            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'Error al subir imagen'
            );
        } else {

            $imagen_name = time() . $imagen->getClientOriginalName();
            Storage::disk('usuarios')->put($imagen_name, File::get($imagen));
            //Devolver el resultado
            $data = array(
                'code' => 200,
                'status' => 'success',
                'imagen' => $imagen_name
            );
        }





        return response()->json($data, $data['code']);
    }

    //Obtener imagen del avatar
    public function getImagen($filename) {
        $isset = Storage::disk('usuarios')->exists($filename);
        if ($isset) {
            $file = Storage::disk('usuarios')->get($filename);
            return new Response($file, 200);
        } else {
            $data = array(
                'code' => 404,
                'status' => 'error',
                'message' => 'La imagen no existe'
            );
            return response()->json($data, $data['code']);
        }
    }
    
    public function profile($id){
        $usuario = Usuario::find($id);
        
        if(is_object($usuario)){
            $data = array(
                'code' => 200,
                'status' => 'success',
                'user' => $usuario
            );
        }else{
            $data = array(
                'code' => 404,
                'status' => 'error',
                'message' => 'El usuario no existe'
            );
        }
        return response()->json($data, $data['code']);
    }

}
