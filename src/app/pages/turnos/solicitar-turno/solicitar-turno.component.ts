import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
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
  isAdmin = false;

  pacientes: any[] = [];

  especialidades: string[] = [];
  selectedEspecialidad: string;

  especialistas: any[] = [];
  filteredEspecialistas: any[] = [];
  selectedEspecialista: any;

  daysOfWeek: string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
  daysOfWeekEng: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  hoursOfDay: string[] = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];
  dates: Date[] = [];
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
      paciente: ['', Validators.required],
      especialidad: ['', Validators.required],
      especialista: ['', Validators.required],
      fechaHora: ['', Validators.required]
    });

    // Assing paciente
    if (this.authService.usuarioDB.type === 'admin') {
      this.isAdmin = true;
      this.pacientes = await this.userService.getPacientes();
    }
    else {
      this.turnoForm.controls['paciente'].setValue(this.authService.usuarioDB);
    }

    this.orderDays();

    this.getDates();

    this.especialidadesService.getEspecialidades().subscribe(
      especialidades => {
        this.especialidades = especialidades.map(especialidad => {
          return especialidad.name.charAt(0).toUpperCase() + especialidad.name.slice(1);
        });
      });

    this.especialistas = await this.userService.getEspecialistas();
    this.filteredEspecialistas = this.especialistas;
  }

  orderDays() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayIndex = this.daysOfWeekEng.findIndex(day => day === today);

    if (todayIndex !== -1) {
      this.daysOfWeek = [
        ...this.daysOfWeek.slice(todayIndex),
        ...this.daysOfWeek.slice(0, todayIndex)
      ];
    } else {
      // es domingo, no se hace ningún cambio
    }
  }

  getDates() {
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day

    for (let i = 0; this.dates.length < 6; i++) {
      const nextDate = new Date(today.getTime() + i * oneDay);
      if (nextDate.getDay() !== 0) {
        this.dates.push(nextDate);
      }
    }

    console.log(this.dates);
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

  selectHorario(date: Date, day: string, hourString: string) {
    // HTML manipulation
    const timeButtons = document.getElementsByClassName('time-button');

    for (let i = 0; i < timeButtons.length; i++) {
      const element = timeButtons[i];
      element.classList.remove('selected');
      if (element.querySelector('input[type="checkbox"]')) {
        (element.querySelector('input[type="checkbox"]') as HTMLInputElement).checked = false;
      }
    }

    document.getElementById(day + "-" + hourString)?.classList.add('selected');
    (document.getElementById(day + "-" + hourString)!.querySelector('input[type="checkbox"]') as HTMLInputElement).checked = true;

    // Setting datetime in the form
    // Extract hour value from the string
    const hour = parseInt(hourString, 10);

    // Adjust hour to 24-hour format if necessary
    const adjustedHour = hourString.includes('pm') && hour !== 12 ? hour + 12 : hour;
    date.setHours(adjustedHour, 0, 0);
    const timestamp = Timestamp.fromDate(date);
    this.turnoForm.controls['fechaHora'].setValue(timestamp);
  }
}
