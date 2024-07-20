import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection } from '@capacitor-community/sqlite';
import { Platform } from '@ionic/angular';
import { Publicacion } from '../models/publicacionModel';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private db: SQLiteDBConnection | undefined;
  private sqlite: SQLiteConnection;
  private plataforma: string | undefined;
  private readonly DB_NAME = 'publicacionesDB';
  private readonly DB_ENCRIPTADA = false;
  private readonly DB_MODE = 'no-encryption';
  private readonly DB_VERSION = 1;
  private readonly DB_READ_ONLY = false;
  private readonly DB_SQL_TABLAS = `
    CREATE TABLE IF NOT EXISTS publicaciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      imagen TEXT,
      fechaCreacion TEXT NOT NULL
    )
  `;

  private publicacionesSubject = new BehaviorSubject<Publicacion[]>([]);
  public publicaciones$: Observable<Publicacion[]> = this.publicacionesSubject.asObservable();

  constructor(private platform: Platform) {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    this.platform.ready().then(() => {
      this.iniciarPlugin();
    });
  }

  private async _iniciarPluginWeb(): Promise<void> {
    console.log('Iniciando plugin web');
    await customElements.whenDefined('jeep-sqlite');
    const jeepSqliteEl = document.querySelector('jeep-sqlite');
    if (jeepSqliteEl != null) {
      await this.sqlite.initWebStore();
      console.log('Plugin web iniciado correctamente');
    } else {
      console.error('El elemento jeep-sqlite no está presente en el DOM');
    }
  }

  private async abrirConexion() {
    try {
      console.log('Verificando consistencia de conexiones');
      const ret = await this.sqlite.checkConnectionsConsistency();
      console.log('Consistencia de conexiones verificada', ret);
      const isConn = (await this.sqlite.isConnection(this.DB_NAME, this.DB_READ_ONLY)).result;
      if (ret.result && isConn) {
        this.db = await this.sqlite.retrieveConnection(this.DB_NAME, this.DB_READ_ONLY);
        console.log('Conexión existente recuperada');
      } else {
        this.db = await this.sqlite.createConnection(
          this.DB_NAME,
          this.DB_ENCRIPTADA,
          this.DB_MODE,
          this.DB_VERSION,
          this.DB_READ_ONLY
        );
        console.log('Nueva conexión creada');
      }
      await this.db.open();
      console.log('Conexión a la base de datos abierta');
    } catch (error) {
      console.error('Error al abrir la conexión a la base de datos', error);
    }
  }

  private async verificarConexion() {
    if (!this.db) {
      console.log('La base de datos no está inicializada, iniciando plugin');
      await this.iniciarPlugin();
    } else {
      console.log('La base de datos ya está inicializada');
    }
  }

  public async iniciarPlugin() {
    this.plataforma = Capacitor.getPlatform();
    console.log('Plataforma:', this.plataforma);
    if (this.plataforma === 'web') {
      await this._iniciarPluginWeb();
    }
    await this.abrirConexion();
    await this.db?.execute(this.DB_SQL_TABLAS);
    await this.cargarPublicaciones();
  }

  private async cargarPublicaciones() {
    await this.verificarConexion();
    if (!this.db) {
      throw new Error('La base de datos no está inicializada');
    }
    try {
      const res = await this.db.query('SELECT * FROM publicaciones');
      console.log('Publicaciones obtenidas de la base de datos:', res.values);
      // Convertir las fechas de string ISO a objetos Date
      const publicaciones = (res.values as Publicacion[]).map(pub => ({
        ...pub,
        fechaCreacion: new Date(pub.fechaCreacion)
      }));
      this.publicacionesSubject.next(publicaciones);
    } catch (e) {
      console.error('Error al cargar las publicaciones', e);
    }
  }

  public async agregarPublicacion(publicacion: Publicacion): Promise<void> {
    await this.verificarConexion();
    if (!this.db) {
      throw new Error('La base de datos no está inicializada');
    }
    try {
      const query = `INSERT INTO publicaciones (nombre, descripcion, imagen, fechaCreacion) VALUES (?, ?, ?, ?)`;
      const values = [
        publicacion.nombre,
        publicacion.descripcion,
        publicacion.imagen ?? null,
        publicacion.fechaCreacion.toISOString() // Convertir la fecha a string ISO
      ];
      await this.db.run(query, values);
      await this.cargarPublicaciones();
      console.log('Publicación agregada correctamente', publicacion);
    } catch (e) {
      console.error('Error al agregar la publicación', e);
    }
  }

  public async eliminarPublicacion(id: number): Promise<void> {
    await this.verificarConexion();
    if (!this.db) {
      throw new Error('La base de datos no está inicializada');
    }
    try {
      await this.db.run('DELETE FROM publicaciones WHERE id = ?', [id]);
      await this.cargarPublicaciones(); // Recargar las publicaciones después de eliminar una
      console.log('Publicación eliminada correctamente', id);
    } catch (e) {
      console.error('Error al eliminar la publicación', e);
    }
  }

  public async obtenerTodasLasPublicaciones(): Promise<Publicacion[]> {
    await this.verificarConexion();
    if (!this.db) {
      throw new Error('La base de datos no está inicializada');
    }
    try {
      const res = await this.db.query('SELECT * FROM publicaciones');
      // Convertir las fechas de string ISO a objetos Date
      return (res.values as Publicacion[]).map(pub => ({
        ...pub,
        fechaCreacion: new Date(pub.fechaCreacion)
      }));
    } catch (e) {
      console.error('Error al obtener todas las publicaciones', e);
      return [];
    }
  }
}