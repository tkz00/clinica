import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { getDocs, collection, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  itemsCollection !: AngularFirestoreCollection<any>;
  todasLasEspecialidades !: Observable<any[]>;

  constructor(
    private firestore: AngularFirestore,
    private firestore2: Firestore
  ) { }

  getEspecialidades() {
    this.itemsCollection = this.firestore.collection<any>('especialidades');
    return this.todasLasEspecialidades = this.itemsCollection.valueChanges();
  }

  async getEspecialidadesAsync() {
    const querySnapshot = await getDocs(collection(this.firestore2, 'especialidades'));
    return querySnapshot.docs.map((doc) => {
      return doc.data();
    });
  }

  async newEspecialidad(newEspecialidad: string) {
    await this.firestore.collection('especialidades').doc(newEspecialidad).set({ name: newEspecialidad });
  }
}
