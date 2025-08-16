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

COMMIT;


