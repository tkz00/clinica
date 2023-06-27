import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';
import { BehaviorSubject, take } from 'rxjs';

import { environment } from 'src/enviorments/environment';
import firebase from "firebase/compat/app";
import "firebase/auth";
import { LoggerService } from './logger.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // userFirebase: any; // no se si voy a necesitar esto
  usuarioDB: any;

  isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private af: AngularFireAuth,
    private userService: UserService,
    private loggerService: LoggerService
  ) { }

  async login(email: string, password: string) {
    return this.af.signInWithEmailAndPassword(email, password).then(
      async e => {
        this.usuarioDB = await this.userService.getUserById(e.user?.uid!);

        if (this.usuarioDB.type === 'especialista' && (!this.usuarioDB.enabled || !this.usuarioDB.verified)) {
          this.af.signOut();
          this.usuarioDB = null;
          throw new Error('Usuario especialista no está validado por un administrador o no ha sido verificado, por favor revise su mail (revisar casilla de spam).');
        }

        if (this.usuarioDB.type === 'paciente' && !this.usuarioDB.verified) {
          this.af.signOut();
          this.usuarioDB = null;
          throw new Error('Usuario paciente no ha sido verificado, por favor revise su mail (revisar casilla de spam).');
        }

        this.loggerService.registerLogin(e.user?.uid!, email);

        this.isLoggedInSubject.next(true);
      }
    );
  }

  async register(email: string, password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.isLoggedIn$.pipe(take(1)).subscribe(async (isLoggedIn) => {
        try {
          if (isLoggedIn) {
            firebase.initializeApp(environment.firebase, 'Secondary');
            const auth = firebase.auth();
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            resolve(userCredential.user?.uid!);
          } else {
            const userCredential = await this.af.createUserWithEmailAndPassword(email, password);
            this.login(email, password);
            this.loggerService.registerLogin(userCredential.user?.uid!, email);
            resolve(userCredential.user?.uid!);
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  }


  logout() {
    this.af.signOut();
    this.isLoggedInSubject.next(false);
  }
}
