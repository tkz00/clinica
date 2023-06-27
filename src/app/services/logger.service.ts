import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(
    private firestore: Firestore
  ) { }

  async registerLogin(userUID: string, userEmail: string) {
    const now = new Date();

    const log = {
      uid: userUID,
      email: userEmail,
      signInTime: now
    }
    const loginLogReference = collection(this.firestore, 'loginLogs');
    return addDoc(loginLogReference, log);
  }

  async getLoginLogs() {
    const loginLogReference = collection(this.firestore, 'loginLogs');
    const querySnapshot = await getDocs(loginLogReference);
    const logs: any[] = querySnapshot.docs.map(log => {
      const { id } = log;
      return { id, ...log.data() };
    });

    logs.sort((a, b) => b.signInTime - a.signInTime);

    return logs;
  }
}
