import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EspecialidadesService } from 'src/app/services/especialidades.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent implements OnInit {

  turnoForm: FormGroup;
  isLoading = false;

  especialidades: string[] = [];
  selectedEspecialidad: string;

  especialistas: any[] = [];
  filteredEspecialistas: any[] = [];
  selectedEspecialista: any;

  daysOfWeek: string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
  hoursOfDay: string[] = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];
  availability: { [day: string]: string[] } = {};

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private especialidadesService: EspecialidadesService,
    private turnosService: TurnosService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  async ngOnInit() {
    this.turnoForm = this.formBuilder.group({
      paciente: [this.authService.usuarioDB, Validators.required],
      especialidad: ['', Validators.required],
      especialista: ['', Validators.required],
      fechaHora: ['', Validators.required]
    });

    this.especialidadesService.getEspecialidades().subscribe(
      especialidades => {
        this.especialidades = especialidades.map(especialidad => {
          return especialidad.name.charAt(0).toUpperCase() + especialidad.name.slice(1);
        });
        // this.filteredEspecialidades = this.especialidades;
      });

    this.especialistas = await this.userService.getEspecialistas();
    this.filteredEspecialistas = this.especialistas;
  }

  async onSubmit() {
    this.isLoading = true;
    await this.turnosService.createTurno(this.turnoForm.value);
    this.isLoading = false;
    Swal.fire({
      title: 'Turno creado con éxito',
      icon: 'success',
      confirmButtonText: 'continuar'
    }).then(() => {
      this.router.navigate(['/']);
    });
  }

  onSelectEspecialidad(event: any) {
    this.turnoForm.controls['especialidad'].setValue(event);
    this.turnoForm.controls['especialista'].setValue(null);
    this.selectedEspecialista = null;
    this.filteredEspecialistas = this.especialistas.filter((especialista) => especialista.especialidad == event);
  }

  onSelectEspecialista(event: any) {
    this.turnoForm.controls['especialista'].setValue(event);
    this.selectedEspecialista = event;
    if (this.selectedEspecialista.horarios) {
      this.availability = this.selectedEspecialista.horarios;
    }
  }

  isAvailable(day: string, hour: string) {
    return this.availability[day] && this.availability[day].includes(hour);
  }

  selectHorario(day: string, hour: string) {
    const timeButtons = document.getElementsByClassName('time-button');

    for (let i = 0; i < timeButtons.length; i++) {
      const element = timeButtons[i];
      element.classList.remove('selected');
      if (element.querySelector('input[type="checkbox"]')) {
        (element.querySelector('input[type="checkbox"]') as HTMLInputElement).checked = false;
      }
    }

    document.getElementById(day + "-" + hour)?.classList.add('selected');
    (document.getElementById(day + "-" + hour)!.querySelector('input[type="checkbox"]') as HTMLInputElement).checked = true;

    this.turnoForm.controls['fechaHora'].setValue(day + " " + hour);
  }
}
