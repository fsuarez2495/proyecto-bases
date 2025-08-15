CREATE TABLE Paises (
    id_pais NUMBER PRIMARY KEY,
    nombre VARCHAR2(50) UNIQUE NOT NULL
);

CREATE TABLE Almacenamiento (
    id_almacenamiento NUMBER PRIMARY KEY,
    capacidad_almacenamiento NUMBER UNIQUE NOT NULL
);

CREATE TABLE Colores (
    id_color NUMBER PRIMARY KEY,
    nombre VARCHAR2(50) UNIQUE NOT NULL
);

CREATE TABLE Tipos_archivos (
    id_tipo_archivo NUMBER PRIMARY KEY,
    nombre VARCHAR2(50) UNIQUE NOT NULL,
    extension VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE Tipos_accesos (
    id_tipo_acceso NUMBER PRIMARY KEY,
    tipo_acceso VARCHAR2(50) UNIQUE NOT NULL,
    enlace VARCHAR2(250) UNIQUE NOT NULL,
    rol VARCHAR2(50) UNIQUE NOT NULL
);

CREATE TABLE USUARIOS2 (
    ID_USUARIO NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    NOMBRE VARCHAR2(50 BYTE) NOT NULL,
    APELLIDO VARCHAR2(50 BYTE) NOT NULL,
    CORREO_ELECTRONICO VARCHAR2(50 BYTE) UNIQUE NOT NULL,
    contrasena VARCHAR2(50 BYTE) NOT NULL,
    id_almacenamiento NUMBER REFERENCES Almacenamiento(id_almacenamiento),
    id_pais NUMBER NOT NULL REFERENCES Paises(id_pais)
);

CREATE TABLE Carpetas (
    id_carpeta NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(50) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_ultima_modificacion TIMESTAMP,
    id_usuario_propietario NUMBER NOT NULL REFERENCES USUARIOS2(id_usuario),
    id_carpeta_padre NUMBER REFERENCES Carpetas(id_carpeta),
    id_color NUMBER NOT NULL REFERENCES Colores(id_color),
    estado_papelera NUMBER(1) DEFAULT 0 NOT NULL
);

CREATE TABLE Archivos (
    id_archivo NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR2(50) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_visto TIMESTAMP NOT NULL,
    tamano_archivo NUMBER NOT NULL,
    id_tipo_archivo NUMBER NOT NULL REFERENCES Tipos_archivos(id_tipo_archivo),
    id_usuario_propietario NUMBER NOT NULL REFERENCES USUARIOS2(id_usuario),
    id_carpeta_ubicacion NUMBER REFERENCES Carpetas(id_carpeta),
    estado_papelera NUMBER(1) DEFAULT 0 NOT NULL
);

CREATE TABLE Compartidos (
    id_usuario_receptor NUMBER NOT NULL REFERENCES USUARIOS2(id_usuario),
    id_usuario_comparte NUMBER NOT NULL REFERENCES USUARIOS2(id_usuario),
    id_carpeta_compartida NUMBER REFERENCES Carpetas(id_carpeta),
    id_archivo_compartido NUMBER REFERENCES Archivos(id_archivo),
    id_tipo_acceso NUMBER NOT NULL REFERENCES Tipos_accesos(id_tipo_acceso),

    CONSTRAINT pk_compartidos PRIMARY KEY (id_usuario_receptor, id_archivo_compartido)
);

CREATE TABLE Comentarios (
    id_comentario NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR2(300) NOT NULL,
    fecha_comentario TIMESTAMP NOT NULL,
    id_usuario_comentador NUMBER NOT NULL REFERENCES USUARIOS2(id_usuario),
    id_archivo NUMBER NOT NULL REFERENCES Archivos(id_archivo)
);

