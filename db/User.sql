--Crear nuevo usuario(esquema) con el password "PASSWORD" 
CREATE USER C##BLU
  IDENTIFIED BY "oracle"
  DEFAULT TABLESPACE USERS
  TEMPORARY TABLESPACE TEMP;
--asignar cuota ilimitada al tablespace por defecto  
ALTER USER C##BLU QUOTA UNLIMITED ON USERS;

--Asignar privilegios basicos
GRANT create session TO C##BLU;
GRANT create table TO C##BLU;
GRANT create view TO C##BLU;
GRANT create any trigger TO C##BLU;
GRANT create any procedure TO C##BLU;
GRANT create sequence TO C##BLU;
GRANT create synonym TO C##BLU;