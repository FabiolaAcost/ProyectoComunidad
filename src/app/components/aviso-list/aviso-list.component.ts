import { Component, OnInit } from '@angular/core';
import { Publicacion } from '../../models/publicacionModel';
import { PublicacionService } from '../../services/publicacion.service';
import { IonThumbnail, IonButton, IonButtons, IonList, IonItem, IonIcon, IonImg, IonLabel, IonModal, IonHeader, IonToolbar, IonTitle }  from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-aviso-list',
  templateUrl: './aviso-list.component.html',
  styleUrls: ['./aviso-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,IonThumbnail, IonTitle, IonToolbar, IonHeader, IonModal, IonLabel, IonImg, IonIcon, IonList, IonItem, IonButton, IonButtons]
})
export class AvisoListComponent implements OnInit {

  avisos: Publicacion[] = [];
  isDeleteModalOpen = false;
  selectedAviso?: Publicacion;

  constructor(private publicacionService: PublicacionService) {
    addIcons({ trashOutline });
  }

  ngOnInit() {
    this.publicacionService.publicaciones$.subscribe((publicaciones) => {
      this.avisos = publicaciones;
    });
    this.loadAvisos();
  }

  async loadAvisos() {
    this.avisos = await this.publicacionService.obtenerTodasLasPublicaciones();
  }

  openDeleteConfirmModal(aviso: Publicacion) {
    this.selectedAviso = aviso;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  async confirmDelete() {
    if (this.selectedAviso) {
      await this.publicacionService.eliminarPublicacion(this.selectedAviso.id!);
      this.avisos = await this.publicacionService.obtenerTodasLasPublicaciones();
      this.closeDeleteModal();
    }
  }

  onWillDismiss(event: any) {
    if (event.role === 'save') {
      this.confirmDelete();
    }
  }

  onWillDismissDelete(event:any){

  }
}
