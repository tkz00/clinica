import { Component, OnInit } from '@angular/core';
import { slideInOutFromBottomAnimation } from '../../animations';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  animations: [slideInOutFromBottomAnimation]
})
export class RegistroComponent implements OnInit {

  ngOnInit() { }

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
