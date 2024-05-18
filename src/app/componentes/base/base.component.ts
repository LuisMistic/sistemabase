import { Component, OnInit } from '@angular/core';
import { IndexedDBService } from '../../indexed-db.service';

export interface Producto {
  nombre: string;
  estilo: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  fechaCompra: string;
}

export interface Cliente {
  nombre: string;
  productos: Producto[];
  subtotal: number;
  fecha: string;
}

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {
  productoSeleccionado: Producto | null = null;
  clienteSeleccionado: Cliente | null = null;
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  nuevoProductoNombre: string = '';
  nuevoProductoEstilo: string = '';
  nuevoProductoPrecio: number = 0;
  nuevoClienteNombre: string = '';
  busquedaCliente: string = '';

  clienteEditando: Cliente | null = null;
  productosSugeridos: string[] = ['Cerveza', 'Vino', 'Refresco', 'Agua'];
  productosBarraAbajo: { nombre: string; estilo: string; cantidad: number; color: string }[] = [];
  
  // Nuevas propiedades para el formulario de ingreso de producto
  mostrarFormularioIngreso: boolean = false;
  costoConsumoProducto: number = 0;

  constructor(public indexedDBService: IndexedDBService) {
    const storedClientes = localStorage.getItem('clientes');
    if (storedClientes) {
      this.clientes = JSON.parse(storedClientes);
      this.clientesFiltrados = this.clientes;
      this.productosBarraAbajo = JSON.parse(localStorage.getItem('productosBarraAbajo') || '[]');
    }
  }

  ngOnInit() {
    this.indexedDBService.obtenerClientes().subscribe((clientes: Cliente[]) => {
      this.clientes = clientes as Cliente[];
      this.clientesFiltrados = clientes as Cliente[];
      this.actualizarDatosProductos();
    });
  }

  actualizarDatosProductos(): void {
    const productosClientes: Producto[] = this.clientes.reduce((productos: Producto[], cliente: Cliente) => {
      return productos.concat(cliente.productos);
    }, []);

    const productosBarraAbajoJSON = JSON.stringify(this.productosBarraAbajo);

    localStorage.setItem('productosClientes', JSON.stringify(productosClientes));
    localStorage.setItem('productosBarraAbajo', productosBarraAbajoJSON);

    console.log('Datos de productos actualizados en el almacenamiento local.');
  }

  agregarNuevoCliente() {
    const nombreCliente = this.nuevoClienteNombre.trim();

    if (nombreCliente === '') {
      return;
    }

    const clienteExistente = this.clientes.find(cliente => cliente.nombre.toLowerCase() === nombreCliente.toLowerCase());

    if (clienteExistente) {
      console.log(`El cliente "${nombreCliente}" ya existe.`);
      return;
    }

    const nuevaFecha = new Date().toLocaleString();
    const nuevoCliente: Cliente = {
      nombre: nombreCliente,
      productos: [],
      subtotal: 0,
      fecha: nuevaFecha
    };

    this.clientes.unshift(nuevoCliente);
    this.clientesFiltrados = [...this.clientes];
    this.nuevoClienteNombre = '';
    this.actualizarDatos();
  }

  seleccionarCliente(cliente: Cliente) {
    this.clienteSeleccionado = this.clienteSeleccionado === cliente ? null : cliente;
  }

  editarCliente(cliente: Cliente) {
    this.clienteEditando = this.clienteEditando === cliente ? null : { ...cliente };
    this.actualizarDatos();
  }

  guardarEdicionCliente(cliente: Cliente) {
    this.clienteEditando = null;
    this.actualizarDatos();
  }

  eliminarCliente(index: number, event: MouseEvent) {
    event.stopPropagation();
    this.clientes.splice(index, 1);
    this.clientesFiltrados = this.clientes;
    this.actualizarDatos();
  }

  toggleCliente(cliente: Cliente) {
    this.clienteSeleccionado = this.clienteSeleccionado === cliente ? null : cliente;
  }

  agregarProductoCliente(cliente: Cliente) {
    const nuevaFecha = new Date().toLocaleString();
    const nuevoProducto: Producto = {
      nombre: this.nuevoProductoNombre,
      estilo: this.nuevoProductoEstilo,
      precio: this.nuevoProductoPrecio,
      cantidad: 1,
      subtotal: this.nuevoProductoPrecio,
      fechaCompra: nuevaFecha
    };
    cliente.productos.push(nuevoProducto);
    this.actualizarSubtotalCliente(cliente);
    this.actualizarProductosBarraAbajo(nuevoProducto);

    this.nuevoProductoNombre = '';
    this.nuevoProductoEstilo = '';
    this.nuevoProductoPrecio = 0;
    this.mostrarFormularioIngreso = false; // Ocultar el formulario después de agregar el producto
    this.actualizarDatos();
  }

  venderProducto(cliente: Cliente, producto: Producto) {
    const nuevaFecha = new Date().toLocaleString();
    producto.cantidad++;
    producto.subtotal = producto.cantidad * producto.precio;
    producto.fechaCompra = nuevaFecha;
    this.actualizarSubtotalCliente(cliente);
    this.actualizarProductosBarraAbajo(producto);
    this.actualizarDatos();
  }

  borrarProducto(cliente: Cliente, index: number) {
    const producto = cliente.productos[index];

    if (producto.cantidad > 1) {
      producto.cantidad--;
      producto.subtotal -= producto.precio;
    } else {
      cliente.productos.splice(index, 1);
    }

    this.actualizarSubtotalCliente(cliente);
    this.eliminarProductoBarraAbajo(producto);
    this.actualizarDatos();
  }

  reiniciarPlanilla() {
    this.clientes = [];
    this.clientesFiltrados = [];
    this.productosBarraAbajo = [];
    this.actualizarDatos();
  }

  calcularTotal() {
    return this.clientes.reduce((total, cliente) => total + cliente.subtotal, 0);
  }

  calcularCantidadProductosVendidos(): number {
    let totalProductosVendidos = 0;
    this.clientes.forEach(cliente => {
      cliente.productos.forEach(producto => {
        totalProductosVendidos += producto.cantidad;
      });
    });
    return totalProductosVendidos;
  }

  mostrarFormularioProducto(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
  }

  filtrarClientes() {
    const busqueda = this.busquedaCliente.trim().toLowerCase();
    if (busqueda === '') {
      this.clientesFiltrados = this.clientes;
    } else {
      this.clientesFiltrados = this.clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(busqueda)
      );
    }
  }

  private actualizarSubtotalCliente(cliente: Cliente) {
    cliente.subtotal = cliente.productos.reduce((total, producto) => total + producto.subtotal, 0);
  }

  private actualizarDatos() {
    localStorage.setItem('clientes',
    JSON.stringify(this.clientes));
    localStorage.setItem('productosBarraAbajo', JSON.stringify(this.productosBarraAbajo));
  }

  private actualizarProductosBarraAbajo(producto: Producto) {
    const productoExistente = this.productosBarraAbajo.find(item => item.nombre === producto.nombre && item.estilo === producto.estilo);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        const color = this.generarColor(producto.estilo);
        this.productosBarraAbajo.push({
            nombre: producto.nombre,
            estilo: producto.estilo,
            cantidad: 1,
            color: color
        });
    }
  }

  private eliminarProductoBarraAbajo(producto: Producto) {
    const productoExistenteIndex = this.productosBarraAbajo.findIndex(item => item.nombre === producto.nombre && item.estilo === producto.estilo);

    if (productoExistenteIndex !== -1) {
      const productoExistente = this.productosBarraAbajo[productoExistenteIndex];
      if (productoExistente.cantidad > 1) {
        productoExistente.cantidad--;
      } else {
        this.productosBarraAbajo.splice(productoExistenteIndex, 1);
      }
    }
  }

  calcularSubtotalCliente(cliente: Cliente): number {
    return cliente.productos.reduce((total, producto) => total + producto.subtotal, 0);
  }

  private generarColor(estilo: string): string {
    const hash = estilo.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const r = (hash & 0xFF0000) >> 16;
    const g = (hash & 0x00FF00) >> 8;
    const b = hash & 0x0000FF;
    const luminosidad = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const colorTexto = luminosidad > 0.5 ? '#ffffff' : '#000000';
    const brillo = 0.9;
    const colorFondo = '#' + ((r * brillo << 16) + (g * brillo << 8) + (b * brillo)).toString(16).padStart(6, '0');
    return colorFondo;
  }

  // Método para mostrar el formulario de ingreso de producto
  mostrarFormularioIngresoProducto() {
    this.mostrarFormularioIngreso = true;
  }
}
