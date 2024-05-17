import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioCompartido {
  currentComponent: string = 'default';
  mostrarAnimacionCierre: boolean = false;
  private componenteCierreSubject = new BehaviorSubject<boolean>(false);

  private clientesSubject = new BehaviorSubject<Cliente[]>([]);
  public clientes$ = this.clientesSubject.asObservable();

  constructor() { }

  // Método para mostrar u ocultar el Navbar
  notificarAnimacionCierre(animacion: boolean = false) {
    this.componenteCierreSubject.next(animacion);
    console.log("notifiacion de cierre del servicio");
  }

  obtenerNotificacionCierre(): Observable<boolean> {
    return this.componenteCierreSubject.asObservable();
  }

  cambiarComponente(nombre: string) {
    this.notificarAnimacionCierre(true);
    console.log("notifiacion de cierre con exito");
    setTimeout(() => {
      this.currentComponent = nombre;
      this.notificarAnimacionCierre(false);
    }, 900);
    console.log("tiempo funciona");
  }

  actualizarClientes(clientes: Cliente[]): void {
    this.clientesSubject.next(clientes);
  }

  obtenerClientes(): Observable<Cliente[]> {
    return this.clientes$;
  }
}

interface Producto {
  nombre: string;
  estilo: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  fechaCompra?: string;
}

interface Cliente {
  nombre: string;
  productos: Producto[];
  subtotal: number;
  fecha: string;
}
