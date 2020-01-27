import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import 'rxjs/add/operator/map';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public subirArchivoService: SubirArchivoService
    ) {
    this.cargarStorage();
  }

  crearUsuario(usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario).map((resp: any) => {
      Swal.fire('Usuario creado', usuario.email, 'success');
      return resp.usuario;
    });
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
      localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      this.usuario = usuario;
      this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  login(usuario: Usuario, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    const url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario).map((res: any) => {
      this.guardarStorage(res.id, res.token, res.usuario);
      return true;
    });
  }

  loginGoogle(token: string) {
    const url = URL_SERVICIOS + '/login/google';
    return this.http.post(url, {token}).map((res: any) => {
      this.guardarStorage(res.id, res.token, res.usuario);
      return true;
    });
  }

  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  actualizarUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put(url, usuario).map((resp: any) => {
      if (usuario._id === this.usuario._id) {
        const usuarioDB: Usuario = resp.usuario;
        this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
      }
      Swal.fire('Usuario actualizado', usuario.nombre, 'success');
      return true;
    });
  }

  cambiarImagen(archivo: File, id: string) {
    this.subirArchivoService.subirArchivo(archivo, 'usuarios', id)
    .then((res: any) => {
      this.usuario.img = res.usuario.img;
      Swal.fire('Imagen Actualizada', this.usuario.nombre, 'success');
      this.guardarStorage(id, this.token, this.usuario);
    })
    .catch(err => {
      console.log(err);
    });
  }

  cargarUsuarios(desde: number = 0) {
    const url = URL_SERVICIOS + '/usuario?desde=' + desde;
    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url).map((res: any) => res.usuarios);
  }

  borrarUsuario(id: string) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;
    return this.http.delete(url).map(res => {
      Swal.fire(
        'Usuario Borrado!',
        'El usuario a sido eliminado correctamente',
        'success'
      );
      return true;
    });
  }


}
