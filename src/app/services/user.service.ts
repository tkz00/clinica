import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, first, tap } from 'rxjs';
import { Firestore, collection, addDoc, getDocs, collectionData, doc, setDoc, updateDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private firestore2: Firestore
  ) { }

  async adduser(newUser: any) {
    // this.firestore.collection('users').doc(newUser.id.toString()).set(Object.assign({}, newUser), { merge: true });
    await this.firestore.collection('users').doc(newUser.id.toString()).set(newUser, { merge: true });
  }

  async getUsers() {
    const usersCol = collection(this.firestore2, 'users');
    const usersSnapshot = await getDocs(usersCol);
    return usersSnapshot.docs.map(doc => doc.data());
  }

  async setEnable(newValue: boolean, userId: string) {
    await updateDoc(doc(this.firestore2, 'users', userId), {
      enabled: newValue
    });
  }

  async getUserById(uid: string) {
    return this.firestore
      .collection('users').doc(uid)
      .valueChanges()
      .pipe(
        tap((data) => data),
        first()
      )
      .toPromise();
  }
}