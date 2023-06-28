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
    const especialistaTurns = await this.turnosService.getTurnosByEspecialistaId(this.authService.usuarioDB.id);
    console.log(this.users);
    especialistaTurns.forEach(async turn => {
      console.log(this.users);
      const pacienteTurns = await this.turnosService.getTurnosByPacienteId(turn.data.paciente.id);
      pacienteTurns.sort((a, b) => b.data['fechaHora'].toDate().getTime() - a.data['fechaHora'].toDate().getTime());
      if (!this.users.some(user => user.id === turn.data.paciente.id)) {
        turn.data.paciente.turns = pacienteTurns.slice(0, 3);
        this.users.push(turn.data.paciente);
      }
    });
    console.log(this.users);
    this.isLoading = false;
  }
}
