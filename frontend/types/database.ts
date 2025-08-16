// Tipos basados en las tablas de Oracle
export interface Usuario {
  id: number
  email: string
  nombre: string
  apellido: string
  password_hash: string
  fecha_creacion: Date
  ultimo_acceso: Date
  activo: boolean
  pais_id: number
  almacenamiento_id: number
}

export interface Pais {
  id: number
  nombre: string
  codigo: string
}

export interface Almacenamiento {
  id: number
  usuario_id: number
  espacio_total: number
  espacio_usado: number
  fecha_actualizacion: Date
}

export interface Carpeta {
  id: number
  nombre: string
  usuario_id: number
  carpeta_padre_id?: number
  fecha_creacion: Date
  fecha_modificacion: Date
  color_id?: number
}

export interface Archivo {
  id: number
  nombre: string
  extension: string
  tamaño: number
  ruta: string
  usuario_id: number
  carpeta_id?: number
  tipo_archivo_id: number
  fecha_creacion: Date
  fecha_modificacion: Date
  activo: boolean
}

export interface TipoArchivo {
  id: number
  nombre: string
  extension: string
  icono: string
}

export interface TipoAcceso {
  id: number
  nombre: string
  descripcion: string
}

export interface Compartido {
  id: number
  archivo_id?: number
  carpeta_id?: number
  usuario_propietario_id: number
  usuario_compartido_id: number
  tipo_acceso_id: number
  fecha_compartido: Date
  activo: boolean
}

export interface Comentario {
  id: number
  archivo_id: number
  usuario_id: number
  contenido: string
  fecha_creacion: Date
  activo: boolean
}

export interface Color {
  id: number
  nombre: string
  codigo_hex: string
}

// Tipos para la autenticación
export interface LoginCredentials {
  correo_electronico: string
  contrasena: string
}

export interface AuthUser {
  id: number
  email: string
  nombre: string
  apellido: string
  pais: Pais
  almacenamiento: Almacenamiento
}

export interface RegisterCredentials {
  nombre: string
  apellido: string
  correo_electronico: string
  contrasena: string
  id_pais: number         
}