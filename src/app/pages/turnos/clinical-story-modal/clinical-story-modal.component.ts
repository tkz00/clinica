import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-clinical-story-modal',
  templateUrl: './clinical-story-modal.component.html',
  styleUrls: ['./clinical-story-modal.component.scss']
})
export class ClinicalStoryModalComponent {
  @Output() surveySubmitted: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCloseModal: EventEmitter<any> = new EventEmitter<any>();

  height: number;
  weight: number;
  fever: boolean;
  bloodPressure: string;
  dynamicFields: { key: string, value: any }[] = [];

  constructor() { }

  submitSurvey() {
    const surveyData: { [key: string]: any } = {
      height: this.height,
      weight: this.weight,
      fever: this.fever,
      bloodPressure: this.bloodPressure
    };

    this.dynamicFields.forEach(field => {
      surveyData[field.key] = field.value;
    });

    this.surveySubmitted.emit(surveyData);
    this.closeSurveyModal();
  }

  closeSurveyModal() {
    this.onCloseModal.emit();
  }

  addDynamicField() {
    if (this.dynamicFields.length < 3) {
      this.dynamicFields.push({ key: '', value: '' });
    }
  }

  removeDynamicField(index: number) {
    this.dynamicFields.splice(index, 1);
  }
}
