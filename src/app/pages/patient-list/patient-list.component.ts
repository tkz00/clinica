import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent {
  users: any[] = [];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private turnosService: TurnosService
  ) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    const result = await this.turnosService.getTurnosByEspecialistaId(this.authService.usuarioDB.id);
    result.forEach(turn => {
      if (!this.users.some(user => user.id === turn.data.paciente.id)) {
        this.users.push(turn.data.paciente);
      }
    });
    this.isLoading = false;
  }
}
