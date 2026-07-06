import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { UsuarioService } from '../../../services/usuario';
import { UsuarioRequest, UsuarioResponse } from '../../../models/usuario.model';

type SettingsTab = 'cuenta' | 'crear-admin' | 'usuarios' | 'configuracion';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css'
})
export class AdminSettingsComponent implements OnInit {
  activeTab: SettingsTab = 'cuenta';
  usuarios: UsuarioResponse[] = [];
  usuarioEditando: UsuarioResponse | null = null;
  cargandoUsuarios = false;
  guardandoCuenta = false;
  guardandoAdmin = false;
  guardandoUsuario = false;
  mensaje: string | null = null;
  error: string | null = null;

  cuentaForm: UsuarioRequest = {
    nombre: '',
    email: '',
    password: '',
    rol: 'ADMIN'
  };

  passwordForm = {
    password: '',
    confirmarPassword: ''
  };

  adminForm: UsuarioRequest = {
    nombre: '',
    email: '',
    password: '',
    rol: 'ADMIN'
  };

  usuarioForm: UsuarioRequest = {
    nombre: '',
    email: '',
    password: '',
    rol: 'CLIENTE'
  };

  configuracion = {
    negocio: 'ITMAC Future',
    aviso: 'Los recojos son en la tienda fisica, no hay envio disponible',
    igv: 18,
    entrega: 'Recojo en local',
    correo: 'ventas@itmacfuture.com',
    telefono: '987654321',
    direccion: 'Tienda fisica ITMAC Future'
  };

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarCuenta();
    this.cargarUsuarios();
  }

  cambiarTab(tab: SettingsTab): void {
    this.activeTab = tab;
    this.mensaje = null;
    this.error = null;
  }

  cargarCuenta(): void {
    const id = this.authService.getUserId();

    if (!id) {
      this.error = 'No se pudo identificar tu cuenta.';
      return;
    }

    this.usuarioService.getById(id).subscribe({
      next: (usuario) => {
        this.cuentaForm = {
          nombre: usuario.nombre,
          email: usuario.email,
          password: '',
          rol: usuario.rol
        };
      },
      error: () => {
        this.cuentaForm = {
          nombre: this.authService.getNombre() ?? '',
          email: this.authService.getEmail() ?? '',
          password: '',
          rol: 'ADMIN'
        };
      }
    });
  }

  guardarCuenta(): void {
    const id = this.authService.getUserId();

    if (!id || !this.cuentaForm.nombre.trim() || !this.cuentaForm.email.trim()) {
      this.error = 'Completa nombre y correo.';
      return;
    }

    this.guardandoCuenta = true;
    this.limpiarMensajes();

    this.usuarioService.update(id, {
      nombre: this.cuentaForm.nombre.trim(),
      email: this.cuentaForm.email.trim(),
      password: '',
      rol: 'ADMIN'
    }).subscribe({
      next: (usuario) => {
        this.authService.updateLocalProfile(usuario.nombre, usuario.email);
        this.guardandoCuenta = false;
        this.mensaje = 'Cuenta actualizada correctamente.';
        this.cargarUsuarios();
      },
      error: (err) => {
        this.guardandoCuenta = false;
        this.error = err?.error?.message ?? 'No se pudo actualizar tu cuenta.';
      }
    });
  }

  cambiarPassword(): void {
    const id = this.authService.getUserId();

    if (!id) {
      this.error = 'No se pudo identificar tu cuenta.';
      return;
    }

    if (this.passwordForm.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.passwordForm.password !== this.passwordForm.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.guardandoCuenta = true;
    this.limpiarMensajes();

    this.usuarioService.updatePassword(id, { password: this.passwordForm.password }).subscribe({
      next: () => {
        this.guardandoCuenta = false;
        this.passwordForm = { password: '', confirmarPassword: '' };
        this.mensaje = 'Contraseña actualizada correctamente.';
      },
      error: (err) => {
        this.guardandoCuenta = false;
        this.error = err?.error?.message ?? 'No se pudo actualizar la contraseña.';
      }
    });
  }

  crearAdministrador(): void {
    if (!this.adminForm.nombre.trim() || !this.adminForm.email.trim() || !this.adminForm.password) {
      this.error = 'Completa todos los campos del administrador.';
      return;
    }

    if ((this.adminForm.password ?? '').length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.guardandoAdmin = true;
    this.limpiarMensajes();

    this.usuarioService.createAdmin({
      nombre: this.adminForm.nombre.trim(),
      email: this.adminForm.email.trim(),
      password: this.adminForm.password,
      rol: 'ADMIN'
    }).subscribe({
      next: () => {
        this.guardandoAdmin = false;
        this.adminForm = { nombre: '', email: '', password: '', rol: 'ADMIN' };
        this.mensaje = 'Administrador creado correctamente.';
        this.cargarUsuarios();
      },
      error: (err) => {
        this.guardandoAdmin = false;
        this.error = err?.error?.message ?? 'No se pudo crear el administrador.';
      }
    });
  }

  cargarUsuarios(): void {
    this.cargandoUsuarios = true;

    this.usuarioService.getAll().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.cargandoUsuarios = false;
      },
      error: () => {
        this.cargandoUsuarios = false;
        this.error = 'No se pudieron cargar los usuarios.';
      }
    });
  }

  editarUsuario(usuario: UsuarioResponse): void {
    this.usuarioEditando = usuario;
    this.usuarioForm = {
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      rol: usuario.rol
    };
    this.cambiarTab('usuarios');
  }

  cancelarEdicionUsuario(): void {
    this.usuarioEditando = null;
    this.usuarioForm = { nombre: '', email: '', password: '', rol: 'CLIENTE' };
  }

  guardarUsuario(): void {
    if (!this.usuarioEditando) return;

    this.guardandoUsuario = true;
    this.limpiarMensajes();

    this.usuarioService.update(this.usuarioEditando.id, {
      nombre: this.usuarioForm.nombre.trim(),
      email: this.usuarioForm.email.trim(),
      password: '',
      rol: this.usuarioForm.rol
    }).subscribe({
      next: () => {
        this.guardandoUsuario = false;
        this.mensaje = 'Usuario actualizado correctamente.';
        this.cancelarEdicionUsuario();
        this.cargarUsuarios();
      },
      error: (err) => {
        this.guardandoUsuario = false;
        this.error = err?.error?.message ?? 'No se pudo actualizar el usuario.';
      }
    });
  }

  guardarConfiguracion(): void {
    this.mensaje = 'Configuracion guardada en la vista. Para persistirla se requiere tabla de configuracion.';
    this.error = null;
  }

  private limpiarMensajes(): void {
    this.mensaje = null;
    this.error = null;
  }
}
