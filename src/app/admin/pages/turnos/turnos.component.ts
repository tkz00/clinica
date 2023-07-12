import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TurnosService } from 'src/app/services/turnos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TurnosComponent implements OnInit {

  turnos: any[] = [];
  filteredTurnos: any[] = [];
  filteredTurnosSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  searchValue = '';

  constructor(
    private turnosService: TurnosService
  ) { }

  async ngOnInit(): Promise<void> {
    this.filteredTurnosSubject.subscribe(filteredTurnos => {
      this.filteredTurnos = filteredTurnos;
    });

    this.turnos = await this.turnosService.getTurnos();
    this.filteredTurnos = this.turnos;
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

  filterItems() {
    this.filteredTurnos = this.turnos.filter(turno =>
      turno.data.especialidad.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      turno.data.especialista.nombre.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      turno.data.especialista.apellido.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      turno.data.especialista.email.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      turno.data.paciente.nombre.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      turno.data.paciente.apellido.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      turno.data.paciente.email.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      (turno.data.clinicalStory &&
        getClinicalStoryMatch(turno.data.clinicalStory, this.searchValue.toLowerCase()))
    );
  }

  ngOnDestroy() {
    this.filteredTurnosSubject.unsubscribe();
  }
}

function getClinicalStoryMatch(clinicalStory: any, searchValue: string): boolean {
  const result = clinicalStory.some((clinical: any) => {
    return Object.keys(clinical).some(key => {
      const value = clinical[key];
      return key.includes(searchValue) || (typeof value === 'string' && value.includes(searchValue));
    });
  });
  return result;
}