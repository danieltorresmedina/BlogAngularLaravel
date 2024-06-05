CREATE DATABASE IF NOT EXISTS api_rest_laravel;
USE api_rest_laravel;

CREATE TABLE usuarios(
id int(255) auto_increment NOT NULL, 
nombre varchar(50) NOT NULL,
apellido varchar(100),
email varchar(255) NOT NULL,
password varchar(255) NOT NULL,
rol varchar(20),
descripcion text,
imagen varchar(255),
fecha_creacion datetime DEFAULT NULL,
fecha_actualizacion datetime DEFAULT NULL,
recordar_token varchar(255),
CONSTRAINT pk_usuarios PRIMARY KEY(id)
)ENGINE=InnoDb;

CREATE TABLE categorias(
id int(255) auto_increment NOT NULL,
nombre varchar(100),
fecha_creacion datetime DEFAULT NULL,
fecha_actualizacion datetime DEFAULT NULL,
CONSTRAINT pk_categorias PRIMARY KEY(id)
)ENGINE=InnoDb;

CREATE TABLE publicaciones(
id int(255) auto_increment not null,
id_usuario int(255) not null,
id_categoria int (255) not null,
titulo varchar(255) not null,
contenido text not null,
imagen varchar(255),
fecha_creacion datetime DEFAULT NULL,
fecha_actualizacion datetime DEFAULT NULL,
CONSTRAINT pk_publicaciones PRIMARY KEY(id),
CONSTRAINT fk_publicaciones_usuarios FOREIGN KEY(id_usuario) REFERENCES usuarios(id),
CONSTRAINT fk_publicaciones_categorias FOREIGN KEY(id_categoria) REFERENCES categorias(id)
)ENGINE=InnoDb;