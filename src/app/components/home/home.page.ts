import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrearAvisoComponent } from '../crear-aviso/crear-aviso.component';
import { IonIcon, IonFabButton, IonFab, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { AvisoListComponent } from "../aviso-list/aviso-list.component";
import {addIcons} from 'ionicons';
import {add} from 'ionicons/icons';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFab, IonFabButton, IonHeader, IonToolbar, IonTitle, IonContent, AvisoListComponent, CrearAvisoComponent],
})
export class HomePage {

 constructor(private router: Router) {
    addIcons({ add });
  }

  irACrearAviso() {
    this.router.navigate(['/crear-aviso']);
  }
}