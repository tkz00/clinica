import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';

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
    private userService: UserService
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

        this.isLoggedInSubject.next(true);
      }
    );
  }

  async register(email: string, password: string): Promise<string> {
    // if (this.af.user) {
    //   this.af.currentUser.then(async (user) => {
    //     if (user?.email == 'admin@admin.com') {
    //       const newUserId = await this.af.createUserWithEmailAndPassword(email, password);
    //       this.af.signInWithEmailAndPassword('admin@admin.com', '111111');
    //       return newUserId;
    //     }
    //     return (await this.af.createUserWithEmailAndPassword(email, password)).user?.uid;
    //   });
    // }
    // return (await this.af.createUserWithEmailAndPassword(email, password)).user?.uid!;

    return (await this.af.createUserWithEmailAndPassword(email, password)).user?.uid!;
  }

  logout() {
    this.af.signOut();
    this.isLoggedInSubject.next(false);
  }
}
