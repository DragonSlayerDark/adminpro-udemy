import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import Swal from 'sweetalert2';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {
  oculto: string = '';
  imagenSubir: File;
  imagenTemp: any;
  constructor(
    public subirArchivoService: SubirArchivoService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
  }

  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }
    if (archivo.type.indexOf('image') < 0) {
      this.imagenSubir = null;
      Swal.fire('Solo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      return;
    }
    this.imagenSubir = archivo;
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result;
  }

  subirImagen() {
    this.subirArchivoService.subirArchivo(this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id)
    .then(res => {
      this.modalUploadService.notificacion.emit(res);
      this.cerrarModal();
    })
    .catch(err => {
      console.log('Error en la carga...', err);
    });
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;
    this.modalUploadService.ocultarModal();
  }

}
