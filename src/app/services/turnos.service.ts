import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  constructor(
    private firestore: AngularFirestore,
    private firestore2: Firestore
  ) { }

  async createTurno(value: any) {
    // await this.firestore.collection('users').doc(newUser.id.toString()).set(newUser, { merge: true });
    await this.firestore.collection('turns').add(value);
  }
}
