-- Almacenamiento
INSERT INTO Almacenamiento (id_almacenamiento, capacidad_almacenamiento)
VALUES (1, 1000000);

-- Colores
INSERT INTO Colores (id_color, nombre) VALUES (2, 'Azul');

-- Tipos_archivos
INSERT INTO Tipos_archivos (id_tipo_archivo, nombre, extension) VALUES (1, 'Documento PDF', 'pdf');
INSERT INTO Tipos_archivos (id_tipo_archivo, nombre, extension) VALUES (2, 'Imagen JPEG', 'jpg');

-- Tipos_accesos
INSERT INTO Tipos_accesos (id_tipo_acceso, tipo_acceso, enlace, rol) VALUES (1, 'Lectura', 'https://enlace1.com', 'lector');
INSERT INTO Tipos_accesos (id_tipo_acceso, tipo_acceso, enlace, rol) VALUES (2, 'Edición', 'https://enlace2.com', 'editor');

-- Carpetas
INSERT INTO Carpetas (nombre, fecha_creacion, fecha_ultima_modificacion, id_usuario_propietario, id_carpeta_padre, id_color, estado_papelera)
VALUES ('Carpeta Principal', SYSTIMESTAMP, SYSTIMESTAMP, 2, NULL, 1, 0);

INSERT INTO Carpetas (nombre, fecha_creacion, fecha_ultima_modificacion, id_usuario_propietario, id_color, estado_papelera)
VALUES ('Carpeta Secundaria', SYSTIMESTAMP, SYSTIMESTAMP, 42, 2, 0);

-- Archivos
INSERT INTO Archivos (nombre, fecha_creacion, fecha_visto, tamano_archivo, id_tipo_archivo, id_usuario_propietario, id_carpeta_ubicacion, estado_papelera)
VALUES ('documento1.pdf', SYSTIMESTAMP, SYSTIMESTAMP, 2048, 1, 41, 7, 0);

INSERT INTO Archivos (nombre, fecha_creacion, fecha_visto, tamano_archivo, id_tipo_archivo, id_usuario_propietario, id_carpeta_ubicacion, estado_papelera)
VALUES ('imagen1.jpg', SYSTIMESTAMP, SYSTIMESTAMP, 1024, 2, 2, 8, 0);

-- Compartidos
INSERT INTO Compartidos (id_usuario_receptor, id_usuario_comparte, id_carpeta_compartida, id_archivo_compartido, id_tipo_acceso)
VALUES (2, 41, 10, 6, 1);

INSERT INTO Compartidos (id_usuario_receptor, id_usuario_comparte, id_carpeta_compartida, id_archivo_compartido, id_tipo_acceso)
VALUES (42, 2, 13, 5, 2);

-- Comentarios
INSERT INTO Comentarios (descripcion, fecha_comentario, id_usuario_comentador, id_archivo)
VALUES ('Buen archivo', SYSTIMESTAMP, 2, 5);

INSERT INTO Comentarios (descripcion, fecha_comentario, id_usuario_comentador, id_archivo)
VALUES ('Necesita corrección', SYSTIMESTAMP, 41, 6);

COMMIT;

SELECT *
from CARPETAS;

SELECT *
FROM USUARIOS2;