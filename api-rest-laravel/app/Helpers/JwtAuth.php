<?php
namespace App\Helpers;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\DB;
use App\Models\Usuario;

class JwtAuth{
    
    public $key;
    
    public function __construct() {
        $this->key = 'esto_es_clave_secreta-181821';
    }
    
    
    public function singup($email, $password, $getToken = null){
        
        //Buscar si existe el usuario con sus credenciales
        $usuario = Usuario::where([
            'email' => $email,
            'password' => $password
        ])->first();
        
        //Comprobar si son correctos
        $singup = false;
        if(is_object($usuario)){
            $singup = true;
        }
        
        //Generar el token con los datos del usuario identificado
        if($singup){
            $token = array(
                'sub' => $usuario->id,
                'email' => $usuario->email,
                'nombre' => $usuario->nombre,
                'apellido' => $usuario->apellido,
                'descripcion' => $usuario->descripcion ,
                'imagen' => $usuario->imagen ,
                'rol' => $usuario->rol,
                'iat' => time(),
                'exp' => time() + (7 * 24 * 60 * 60)
            );
            
            $jwt = JWT::encode($token, $this->key, 'HS256');
            $decoded = JWT::decode($jwt, $this->key, ['HS256']);
            
            //Devolver los datos decodificados o el token, en funcion de un parametro
            if(is_null($getToken)){
                $data = $jwt;
            }else{
                $data = $decoded;
            }
            
        }else{
            $data = array(
                'status' => 'error',
                'message' => 'Login incorrecto'
            );
        }
        
        return $data;
    }
    
    //Funcion para validar token
    public function checkToken($jwt, $getIdentity = false){
        $auth = false;
        
        try{
            //Quitar comillas del token
            $jwt = str_replace('"', '',$jwt);
            $decoded = JWT::decode($jwt, $this->key, ['HS256']);
        }catch(\UnexpectedValueException $e){
            $auth = false;
        }catch(\DomainException){
            $auth = false;
        }
        
        if(!empty($decoded) && is_object($decoded) && isset($decoded->sub)){
            $auth = true;
        }else{
            $auth = false;
        }
        
        if($getIdentity){
            return $decoded;
        }
        
        return $auth;
        
    }
    
}

