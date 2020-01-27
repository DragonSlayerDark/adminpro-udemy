import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;
  constructor(
    public usuarioService: UsuarioService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.modalUploadService.notificacion.subscribe(res => this.cargarUsuarios());
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde).subscribe((res: any) => {
      this.totalRegistros = res.total;
      this.usuarios = res.usuarios;
      this.cargando = false;
    });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    if (desde >= this.totalRegistros) {
      return;
    }
    if (desde < 0) {
      return;
    }
    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    console.log(termino);
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }
    this.cargando = true;
    this.usuarioService.buscarUsuarios(termino).subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      this.cargando = false;
    });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this.usuarioService.usuario._id) {
      Swal.fire('No puede borrar usuario', 'No se puede borrar a si mimo', 'error');
      return;
    }
    Swal.fire({
      title: 'Estas seguro?',
      text: 'Estas a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok!'
    }).then((result) => {
      if (result.value) {
        this.usuarioService.borrarUsuario(usuario._id).subscribe((borrado: boolean) => {
          console.log(borrado);
          this.cargarUsuarios();
        });
      }
    });
  }

  guardarUsuario(usuario: Usuario) {
    this.usuarioService.actualizarUsuario(usuario).subscribe();
  }

}
