import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  itemsCollection !: AngularFirestoreCollection<any>;
  todasLasEspecialidades !: Observable<any[]>;

  constructor(
    private firestore: AngularFirestore
  ) { }

  getEspecialidades() {
    this.itemsCollection = this.firestore.collection<any>('especialidades');
    return this.todasLasEspecialidades = this.itemsCollection.valueChanges();
  }

  async newEspecialidad(newEspecialidad: string) {
    await this.firestore.collection('especialidades').doc(newEspecialidad).set({ name: newEspecialidad });
  }
}
