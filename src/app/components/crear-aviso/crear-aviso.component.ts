  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { Camera, CameraResultType } from '@capacitor/camera';
  import { ChangeDetectorRef } from '@angular/core';
  import { Publicacion } from '../../models/publicacionModel';
  import { PublicacionService } from '../../services/publicacion.service';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import {addIcons} from 'ionicons';
  import {cameraOutline, arrowBackOutline} from 'ionicons/icons';
  import { IonButton, IonButtons, IonList, IonItem, IonIcon, IonImg, IonLabel, IonContent, IonHeader, IonToolbar, IonTitle, IonCardContent, IonText, IonCard, IonInput }  from '@ionic/angular/standalone';
  
  @Component({
    selector: 'app-crear-aviso',
    templateUrl: './crear-aviso.component.html',
    styleUrls: ['./crear-aviso.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonInput, IonCard, IonCard, IonText, IonCardContent, IonTitle, IonToolbar, IonHeader, IonContent, IonLabel, IonImg, IonIcon, IonList, IonItem, IonButton, IonButtons]
  
  })
  export class CrearAvisoComponent  implements OnInit {
    nuevoAviso: Publicacion = {
      nombre: '',
      descripcion: '',
      imagen: '',
      fechaCreacion: new Date()
    };
  
    constructor(private router: Router,  private publicacionService: PublicacionService, private changeDetector: ChangeDetectorRef) { 
      addIcons({cameraOutline, arrowBackOutline});
    }
  
    ngOnInit() {
      this.inicializarFormulario();
    }
  
    inicializarFormulario() {
      this.nuevoAviso = {
        nombre: '',
        descripcion: '',
        imagen: '',
        fechaCreacion: new Date()
      };
    }
  
    async capturePhoto() {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Base64
        });
  
        if (image.base64String) {
          this.nuevoAviso.imagen = `data:image/jpeg;base64,${image.base64String}`;
          this.changeDetector.detectChanges();
        }
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  
    async guardarAviso() {
      if (this.nuevoAviso.nombre && this.nuevoAviso.descripcion) {
        await this.publicacionService.agregarPublicacion(this.nuevoAviso);
        console.log("lista ")
        this.router.navigate(['/home']); // Redirige a la página principal después de guardar
      }
    }
  
    goHome() {
      this.router.navigate(['/home']);
    }
  }