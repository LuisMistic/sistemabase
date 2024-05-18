import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Define el tipo Producto
interface Producto {
  nombre: string;
  estilo: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  fechaCompra: string; // Modificado para ser requerido
}

// Define el tipo Cliente
interface Cliente {
  nombre: string;
  productos: Producto[];
  subtotal: number;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private db: IDBDatabase | null = null;
  private clientesSubject = new Subject<Cliente[]>();
  public clientes$ = this.clientesSubject.asObservable();

  constructor() {
    this.initDatabase();
  }

  private async initDatabase() {
    if (!('indexedDB' in window)) {
      console.error('IndexedDB is not supported by your browser.');
      return;
    }

    const request = window.indexedDB.open('mi-base-de-datos', 1);

    request.onerror = (event) => {
      console.error('Error opening IndexedDB', event);
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      console.log('IndexedDB initialized successfully.');
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore('clientes', { keyPath: 'id', autoIncrement: true });
      console.log('IndexedDB upgrade done.');
    };
  }

  async addCliente(cliente: any) {
    if (!this.db) {
      console.error('IndexedDB is not initialized.');
      return;
    }

    const transaction = this.db.transaction('clientes', 'readwrite');
    const objectStore = transaction.objectStore('clientes');
    const request = objectStore.add(cliente);

    request.onerror = (event) => {
      console.error('Error adding cliente to IndexedDB', event);
    };

    request.onsuccess = (event) => {
      console.log('Cliente added successfully to IndexedDB');
    };
  }

  obtenerClientes(): Observable<Cliente[]> {
    const clientes: Cliente[] = [];
    if (!this.db) {
      console.error('IndexedDB is not initialized.');
      return new Observable<Cliente[]>(); // Devuelve un observable vacío en caso de error
    }

    const transaction = this.db.transaction('clientes', 'readonly');
    const objectStore = transaction.objectStore('clientes');
    const request = objectStore.getAll();

    request.onerror = (event) => {
      console.error('Error fetching clientes from IndexedDB', event);
    };

    request.onsuccess = (event) => {
      const result = (event.target as IDBRequest<IDBValidKey[]>).result;
      result.forEach((clienteData: any) => {
        const cliente: Cliente = {
          nombre: clienteData.nombre,
          productos: clienteData.productos,
          subtotal: clienteData.subtotal,
          fecha: clienteData.fecha
        };
        clientes.push(cliente);
      });
      this.clientesSubject.next(clientes);
    };

    return this.clientes$;
  }

  // Agrega otras funciones según tus necesidades, como actualizar o eliminar clientes.
}
