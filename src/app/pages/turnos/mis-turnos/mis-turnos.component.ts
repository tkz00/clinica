import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TurnosService } from 'src/app/services/turnos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss']
})
export class MisTurnosComponent {
  isEspecialista = false;

  turnos: any[] = [];
  filteredTurnos: any[] = [];
  filteredTurnosSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  searchValue = '';

  constructor(
    private authService: AuthService,
    private turnosService: TurnosService
  ) { }

  async ngOnInit(): Promise<void> {
    this.authService.isLoggedIn$.subscribe((status: boolean) => {
      if (status) {
        const user = this.authService.usuarioDB;
        if (user.type === 'especialista') {
          this.isEspecialista = true;
          return;
        }
      }
      this.isEspecialista = false;
    });

    this.filteredTurnosSubject.subscribe(filteredTurnos => {
      this.filteredTurnos = filteredTurnos;
    });

    if (!this.isEspecialista) {
      this.turnos = await this.turnosService.getTurnosByPacienteId(this.authService.usuarioDB.id);
    }
    else {
      this.turnos = await this.turnosService.getTurnosByEspecialistaId(this.authService.usuarioDB.id);
    }

    this.filteredTurnos = this.turnos;

    console.log(this.filteredTurnos);
  }

  async cancelTurn(id: string) {
    Swal.fire({
      title: 'Cancelar turno',
      text: 'Deje un comentario explicando por que cancela el turno',
      input: 'text',
      confirmButtonText: 'Cancelar turno',
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      showLoaderOnConfirm: true,
    }).then(async (response) => {
      if (response.isConfirmed) {
        if (response.value) {
          await this.turnosService.cancelTurn(id, response.value);

          const turnoToUpdate = this.turnos.find(turno => turno.id === id);
          if (turnoToUpdate) {
            turnoToUpdate.data.estado = 'cancelado';
          }
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Deje un comentario para cancelar el turno'
          });
        }
      }
    });
  }

  async rateTurn(id: string) {

  }

  async rejectTurn(id: string) {
    Swal.fire({
      title: 'Rechazar turno',
      text: 'Deje un comentario explicando por que rechaza el turno',
      input: 'text',
      confirmButtonText: 'Rechazar turno',
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      showLoaderOnConfirm: true,
    }).then(async (response) => {
      if (response.isConfirmed) {
        if (response.value) {
          await this.turnosService.rejectTurn(id, response.value);

          const turnoToUpdate = this.turnos.find(turno => turno.id === id);
          if (turnoToUpdate) {
            turnoToUpdate.data.estado = 'rechazado';
            turnoToUpdate.data.cancelMessage = response.value;
          }
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Deje un comentario para rechazar el turno'
          });
        }
      }
    });
  }

  async acceptTurn(id: string) {
    await this.turnosService.acceptTurn(id);
    const turnoToUpdate = this.turnos.find(turno => turno.id === id);
    if (turnoToUpdate) {
      turnoToUpdate.data.estado = 'aceptado';
    }
  }

  async finalizeTurn(id: string) {
    Swal.fire({
      title: 'Finalizar turno',
      text: 'Deje el diagnostico realizado',
      input: 'textarea',
      confirmButtonText: 'Finalizar turno',
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      showLoaderOnConfirm: true,
    }).then(async (response) => {
      if (response.isConfirmed) {
        if (response.value) {
          await this.turnosService.finalizeTurn(id, response.value);

          const turnoToUpdate = this.turnos.find(turno => turno.id === id);
          if (turnoToUpdate) {
            turnoToUpdate.data.estado = 'realizado';
            turnoToUpdate.data.review = response.value;
          }
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Debe dejar una reseña para finalizar el turno'
          });
        }
      }
    });
  }

  async completeSurvey(id: string) {

  }

  seeReview(turn: any) {
    Swal.fire({
      title: (turn.data.cancelMessage ? 'Mensaje de cancelación' : 'Reseña'),
      text: (turn.data.cancelMessage ? turn.data.cancelMessage : turn.data.review),
    });
  }

  filterItems() {
    if (!this.isEspecialista) {
      this.filteredTurnos = this.turnos.filter(turno =>
        turno.data.especialidad.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        turno.data.especialista.nombre.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        turno.data.especialista.apellido.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        turno.data.especialista.email.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
    else {
      this.filteredTurnos = this.turnos.filter(turno =>
        turno.data.especialidad.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        turno.data.paciente.nombre.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        turno.data.paciente.apellido.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        turno.data.paciente.email.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
  }

  ngOnDestroy() {
    this.filteredTurnosSubject.unsubscribe();
  }
}
