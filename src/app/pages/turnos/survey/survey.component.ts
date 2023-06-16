import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent {
  @Output() surveySubmitted: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCloseModal: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  submitSurvey() {
    // Gather the survey data and emit the event
    const surveyData = {
      higiene: (document.getElementById('higiene') as HTMLSelectElement).value,
      atencion: (document.getElementById('atencion') as HTMLSelectElement).value,
      recomendacion: (document.getElementById('recomendacion') as HTMLSelectElement).value
    };
    this.surveySubmitted.emit(surveyData);
    this.onCancel();
  }

  onCancel() {
    this.closeSurveyModal();
  }

  closeSurveyModal() {
    this.onCloseModal.emit();
  }
}
