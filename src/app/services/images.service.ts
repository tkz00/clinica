import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Observable, concat, defer, ignoreElements } from 'rxjs';
import { AuthService } from './auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(
    private afStorage: AngularFireStorage
  ) { }

  uploadImage(file: File, name: string): Observable<string> {
    const fileRef = this.afStorage.ref(`/userImages/${name}`);
    const task = this.afStorage.upload(`/userImages/${name}`, file);
    return concat(
      task.snapshotChanges().pipe(ignoreElements()),
      defer(() => fileRef.getDownloadURL())
    );
  }
}
