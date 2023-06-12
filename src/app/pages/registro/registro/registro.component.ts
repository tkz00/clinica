import { Component } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  public currentComponent: string | undefined;
  isLoading = false;

  goToEspecialistas() {
    this.currentComponent = 'especialistas';
  }

  goToPacientes() {
    this.currentComponent = 'pacientes';
  }

  changeIsLoading(newValue: boolean) {
    this.isLoading = newValue;
  }
}
