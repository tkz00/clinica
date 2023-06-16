import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Firestore, Timestamp, arrayUnion, collection, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  // itemsCollection !: AngularFirestoreCollection<any>;
  // turnos !: Observable<any[]>;

  constructor(
    private firestore: AngularFirestore,
    private firestore2: Firestore
  ) { }

  async createTurno(value: any) {
    // await this.firestore.collection('users').doc(newUser.id.toString()).set(newUser, { merge: true });
    value.estado = 'pendiente';
    await this.firestore.collection('turns').add(value);
  }

  async getTurnos() {
    const querySnapshot = await getDocs(collection(this.firestore2, 'turns'));
    return querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        data: doc.data()
      }
    });
  }

  async getTurnosByPacienteId(id: string) {
    return (await this.getTurnos()).filter(turno => turno.data['paciente'].id === id);
  }

  async getTurnosByEspecialistaId(id: any): Promise<any[] | PromiseLike<any[]>> {
    return (await this.getTurnos()).filter(turno => turno.data['especialista'].id === id);
  }

  async cancelTurn(id: string, message: string) {
    const turnRef = doc(this.firestore2, 'turns', id);
    await updateDoc(turnRef, {
      estado: 'cancelado',
      cancelMessage: message
    });
  }

  async acceptTurn(id: string) {
    const turnRef = doc(this.firestore2, 'turns', id);
    await updateDoc(turnRef, {
      estado: 'aceptado'
    });
  }

  async rejectTurn(id: string, message: string) {
    const turnRef = doc(this.firestore2, 'turns', id);
    await updateDoc(turnRef, {
      estado: 'rechazado',
      cancelMessage: message
    });
  }

  async finalizeTurn(id: string, message: string) {
    const turnRef = doc(this.firestore2, 'turns', id);
    await updateDoc(turnRef, {
      estado: 'realizado',
      review: message
    });
  }

  async submitRating(id: string, ratingData: { rating: number; comment: string }) {
    const turnRef = doc(this.firestore2, 'turns', id);
    await updateDoc(turnRef, {
      rating: ratingData.rating,
      ratingComment: ratingData.comment
    });
  }

  async submitSurvey(id: string, surveyData: any) {
    const turnRef = doc(this.firestore2, 'turns', id);
    await updateDoc(turnRef, {
      survey: surveyData
    });
  }

  async submitClinicalStory(id: string, clinicalStory: any) {
    const turnRef = doc(this.firestore2, 'turns', id);
    await updateDoc(turnRef, {
      clinicalStory: arrayUnion(clinicalStory)
    });
  }
}
