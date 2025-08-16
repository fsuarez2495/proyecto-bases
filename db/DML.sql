-- Insert de paises
INSERT INTO PAISES (ID_PAIS, NOMBRE) VALUES (1, 'Honduras');
INSERT INTO PAISES (ID_PAIS, NOMBRE) VALUES (2, 'México');
INSERT INTO PAISES (ID_PAIS, NOMBRE) VALUES (3, 'Guatemala');
INSERT INTO PAISES (ID_PAIS, NOMBRE) VALUES (4, 'El Salvador');
INSERT INTO PAISES (ID_PAIS, NOMBRE) VALUES (5, 'Nicaragua');
INSERT INTO PAISES (ID_PAIS, NOMBRE) VALUES (6, 'Costa Rica');
INSERT INTO PAISES (ID_PAIS, NOMBRE) VALUES (7, 'Panamá');
INSERT INTO PAISES (ID_PAIS, NOMBRE) VALUES (8, 'Colombia');
INSERT INTO PAISES (ID_PAIS, NOMBRE) VALUES (9, 'Venezuela');
INSERT INTO PAISES (ID_PAIS, NOMBRE) VALUES (10, 'Perú');
INSERT INTO PAISES (ID_PAIS, NOMBRE) VALUES (11, 'Chile');
INSERT INTO PAISES (ID_PAIS, NOMBRE) VALUES (12, 'Argentina');
INSERT INTO PAISES (ID_PAIS, NOMBRE) VALUES (13, 'Brasil');
INSERT INTO PAISES (ID_PAIS, NOMBRE) VALUES (14, 'Paraguay');
INSERT INTO PAISES (ID_PAIS, NOMBRE) VALUES (15, 'Uruguay');

-- Agregar campo para el codigo hexadecimal en la tabla colores 
ALTER TABLE Colores ADD codigo_hex VARCHAR2(7);

-- Insert de colores
INSERT INTO Colores (id_color, nombre, codigo_hex) VALUES (1, 'Azul', '#3B82F6');
INSERT INTO Colores (id_color, nombre, codigo_hex) VALUES (2, 'Verde', '#10B981');
INSERT INTO Colores (id_color, nombre, codigo_hex) VALUES (3, 'Rojo', '#EF4444');
INSERT INTO Colores (id_color, nombre, codigo_hex) VALUES (4, 'Amarillo', '#F59E0B');
INSERT INTO Colores (id_color, nombre, codigo_hex) VALUES (5, 'Púrpura', '#8B5CF6');
INSERT INTO Colores (id_color, nombre, codigo_hex) VALUES (6, 'Rosa', '#EC4899');
INSERT INTO Colores (id_color, nombre, codigo_hex) VALUES (7, 'Índigo', '#6366F1');
INSERT INTO Colores (id_color, nombre, codigo_hex) VALUES (8, 'Naranja', '#F97316');
INSERT INTO Colores (id_color, nombre, codigo_hex) VALUES (9, 'Teal', '#14B8A6');
INSERT INTO Colores (id_color, nombre, codigo_hex) VALUES (10, 'Gris', '#6B7280');

-- Insert Archivos 
INSERT INTO Archivos 
(nombre, fecha_creacion, fecha_visto, tamano_archivo, id_tipo_archivo, id_usuario_propietario, id_carpeta_ubicacion, estado_papelera)
VALUES 
('Documento1.pdf', TO_TIMESTAMP('2025-08-16 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-16 09:05:00', 'YYYY-MM-DD HH24:MI:SS'), 1200, 1, 8, null, 0);

INSERT INTO Archivos 
(nombre, fecha_creacion, fecha_visto, tamano_archivo, id_tipo_archivo, id_usuario_propietario, id_carpeta_ubicacion, estado_papelera)
VALUES 
('Foto_Vacaciones.jpg', TO_TIMESTAMP('2025-08-15 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-15 15:00:00', 'YYYY-MM-DD HH24:MI:SS'), 3500, 1, 9, null, 0);

INSERT INTO Archivos 
(nombre, fecha_creacion, fecha_visto, tamano_archivo, id_tipo_archivo, id_usuario_propietario, id_carpeta_ubicacion, estado_papelera)
VALUES 
('Reporte_Anual.xlsx', TO_TIMESTAMP('2025-08-10 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-12 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 2200, 1, 10, null, 0);

INSERT INTO Archivos 
(nombre, fecha_creacion, fecha_visto, tamano_archivo, id_tipo_archivo, id_usuario_propietario, id_carpeta_ubicacion, estado_papelera)
VALUES 
('Presentacion.pptx', TO_TIMESTAMP('2025-08-12 08:15:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-12 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 4500, 2, 11, null, 0);

INSERT INTO Archivos 
(nombre, fecha_creacion, fecha_visto, tamano_archivo, id_tipo_archivo, id_usuario_propietario, id_carpeta_ubicacion, estado_papelera)
VALUES 
('Video_Tutorial.mp4', TO_TIMESTAMP('2025-08-14 16:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-14 16:30:00', 'YYYY-MM-DD HH24:MI:SS'), 15000, 2, 12, null, 0);


-- Insert Carpetas 
INSERT INTO Carpetas 
(nombre, fecha_creacion, fecha_ultima_modificacion, id_usuario_propietario, id_carpeta_padre, id_color, estado_papelera)
VALUES 
('Documentos', TO_TIMESTAMP('2025-08-10 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-10 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 9, NULL, 1, 1);

INSERT INTO Carpetas 
(nombre, fecha_creacion, fecha_ultima_modificacion, id_usuario_propietario, id_carpeta_padre, id_color, estado_papelera)
VALUES 
('Fotos', TO_TIMESTAMP('2025-08-11 10:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-11 10:30:00', 'YYYY-MM-DD HH24:MI:SS'), 12, 36, 1, 0);

INSERT INTO Carpetas 
(nombre, fecha_creacion, fecha_ultima_modificacion, id_usuario_propietario, id_carpeta_padre, id_color, estado_papelera)
VALUES 
('Trabajo', TO_TIMESTAMP('2025-08-12 08:45:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-12 08:45:00', 'YYYY-MM-DD HH24:MI:SS'), 8, NULL, 3, 1);

INSERT INTO Carpetas 
(nombre, fecha_creacion, fecha_ultima_modificacion, id_usuario_propietario, id_carpeta_padre, id_color, estado_papelera)
VALUES 
('Vacaciones', TO_TIMESTAMP('2025-08-13 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-13 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), 13, 2, 16, 0);

INSERT INTO Carpetas 
(nombre, fecha_creacion, fecha_ultima_modificacion, id_usuario_propietario, id_carpeta_padre, id_color, estado_papelera)
VALUES 
('Proyectos', TO_TIMESTAMP('2025-08-14 11:15:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2025-08-14 11:15:00', 'YYYY-MM-DD HH24:MI:SS'), 13, 3, 36, 0);

-- Insert Tipos Acceso 
INSERT INTO Tipos_accesos (id_tipo_acceso, tipo_acceso, enlace, rol)
VALUES (1, 'Público', 'https://drive.example.com/acceso-publico', 'Editor');

INSERT INTO Tipos_accesos (id_tipo_acceso, tipo_acceso, enlace, rol)
VALUES (2, 'Privado', 'https://drive.example.com/acceso-privado', 'Comentador');

INSERT INTO Tipos_accesos (id_tipo_acceso, tipo_acceso, enlace, rol)
VALUES (3, 'Compartido', 'https://drive.example.com/acceso-compartido', 'Lector');

-- Insert Usuarios
INSERT INTO USUARIOS2 
(NOMBRE, APELLIDO, CORREO_ELECTRONICO, contrasena, id_almacenamiento, id_pais)
VALUES 
('María', 'Zambrano', 'maria.mejia@gmail.com', 'Pass!234', 1, 1);

INSERT INTO USUARIOS2 
(NOMBRE, APELLIDO, CORREO_ELECTRONICO, contrasena, id_almacenamiento, id_pais)
VALUES 
('Juan', 'Pérez', 'juan.perez@gmail.com', 'Ju*an2025!', 2, 6);

INSERT INTO USUARIOS2 
(NOMBRE, APELLIDO, CORREO_ELECTRONICO, contrasena, id_almacenamiento, id_pais)
VALUES 
('Ana', 'Gómez', 'ana.gomez@gmail.com', 'AnaPaess!', 3, 9);

INSERT INTO USUARIOS2 
(NOMBRE, APELLIDO, CORREO_ELECTRONICO, contrasena, id_almacenamiento, id_pais)
VALUES 
('Carlos', 'López', 'carlos.lopez@gmail.com', 'C4rl11os!', 3, 5);

INSERT INTO USUARIOS2 
(NOMBRE, APELLIDO, CORREO_ELECTRONICO, contrasena, id_almacenamiento, id_pais)
VALUES 
('Lucía', 'Ramírez', 'lucia.ramirez@gmail.com', 'Lu*i4Pass', 2, 10);


COMMIT;


