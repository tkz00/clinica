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
  pacientesInput: string = '';
  filteredPacientes: any[] = [];
  selectedPaciente: any;

  especialidades: any[] = [];
  especialidadInput: string = '';
  filteredEspecialidades: any[] = [];
  selectedEspecialidad: any;

  especialistas: any[] = [];
  especialistaInput: string = '';
  filteredEspecialistas: any[] = [];
  selectedEspecialista: any;

  daysOfWeek: string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  daysOfWeekEng: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  availability: any;
  orderedAvailability: any[] = [];
  availableHours: string[];
  selectedDate: any;
  selectedHour: string;

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

    this.especialidadesService.getEspecialidades().subscribe(
      especialidades => {
        this.especialidades = especialidades.map(especialidad => {
          return {
            name: especialidad.name.charAt(0).toUpperCase() + especialidad.name.slice(1),
            imgUrl: especialidad.imgUrl
          };
        });
        this.filteredEspecialidades = this.especialidades;
      }
    );


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

  onSelectPaciente(paciente: any) {
    event!.preventDefault();
    this.turnoForm.controls['paciente'].setValue(paciente);
    this.selectedPaciente = paciente;
  }

  onSelectEspecialidad(especialidad: any) {
    event!.preventDefault();
    this.turnoForm.controls['especialidad'].setValue(especialidad);
    this.turnoForm.controls['especialista'].setValue(null);
    this.selectedEspecialidad = especialidad;
    this.selectedEspecialista = null;
    this.filteredEspecialistas = this.especialistas.filter((especialista) => especialista.especialidad.toLowerCase() == especialidad.name.toLowerCase());
  }

  onSelectEspecialista(especialista: any) {
    event!.preventDefault();
    this.turnoForm.controls['especialista'].setValue(especialista);
    this.selectedEspecialista = especialista;
    if (this.selectedEspecialista.horarios) {
      this.availability = this.selectedEspecialista.horarios;
      this.orderAvailability();
    }
    this.turnoForm.controls['fechaHora'].setValue(null);
    this.selectedDate = null;
    this.selectedHour = '';
  }

  orderAvailability() {
    this.orderedAvailability = [];
    const today = new Date();
    const todayIndex = today.getDay(); // Get the index of today's day (0 = Sunday, 1 = Monday, ...)

    if (todayIndex !== -1) {
      const orderedDaysOfWeek = [
        ...this.daysOfWeek.slice(todayIndex),
        ...this.daysOfWeek.slice(0, todayIndex)
      ];

      for (let index = 0; index < (orderedDaysOfWeek.length * 2); index++) {
        if (this.availability.hasOwnProperty(orderedDaysOfWeek[index])) {
          const availableHours = this.availability[orderedDaysOfWeek[index]];
          const date = new Date(today.getTime() + 24 * 60 * 60 * 1000 * (index + 1)); // Add 1 day for each index
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`; // Format the date as "dd/mm"

          this.orderedAvailability.push({
            day: orderedDaysOfWeek[index],
            dayMonth: formattedDate,
            hours: availableHours
          });
        }

        if (this.availability.hasOwnProperty(orderedDaysOfWeek[index - 7])) {
          const availableHours = this.availability[orderedDaysOfWeek[index - 7]];
          const date = new Date(today.getTime() + 24 * 60 * 60 * 1000 * (index + 1)); // Add 1 day for each index
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`; // Format the date as "dd/mm"

          this.orderedAvailability.push({
            day: orderedDaysOfWeek[index],
            dayMonth: formattedDate,
            hours: availableHours
          });
        }
      }
    }
  }

  selectDate(date: any) {
    event!.preventDefault();
    this.availableHours = orderHours(date.hours);
    this.selectedDate = date;
    this.turnoForm.controls['fechaHora'].setValue(null);
    this.selectedHour = '';
  }

  selectHour(hour: string) {
    event!.preventDefault();
    this.selectedHour = hour;
    const dateTime = parseDateTime(this.selectedDate.dayMonth, this.selectedHour);
    const timestamp = Timestamp.fromDate(dateTime!);
    this.turnoForm.controls['fechaHora'].setValue(timestamp);
  }

  isAvailable(day: string, hour: string) {
    return this.availability[day] && this.availability[day].includes(hour);
  }

  onEspecialidadInputChange(inputElement: any): void {
    this.especialidadInput = inputElement.target.value;
    this.filterEspecialidades();
  }

  filterEspecialidades(): string[] {
    return this.filteredEspecialidades = this.especialidades.filter(especialidad => especialidad.name.toLowerCase().includes(this.especialidadInput.toLowerCase()));
  }

  onEspecialistaInputChange(inputElement: any): void {
    this.especialistaInput = inputElement.target.value;
    this.filterEspecialistas();
  }

  filterEspecialistas(): string[] {
    return this.filteredEspecialistas = this.especialistas.filter((especialista) => especialista.especialidad == this.selectedEspecialidad).filter(especialista => especialista.toLowerCase().includes(this.especialidadInput.toLowerCase()));
  }

  onPacienteInputChange(inputElement: any): void {
    this.pacientesInput = inputElement.target.value;
    this.filterPacientes();
  }

  filterPacientes(): string[] {
    return this.filteredPacientes = this.pacientes.filter(paciente => paciente.toLowerCase().includes(this.pacientesInput.toLowerCase()));
  }
}

function parseDateTime(dateString: string, timeString: string): Date | null {
  const dateRegex = /^(\d{1,2})\/(\d{1,2})$/;
  const timeRegex = /^(\d{1,2})(am|pm)$/i;

  const dateMatch = dateString.match(dateRegex);
  const timeMatch = timeString.match(timeRegex);

  if (dateMatch && timeMatch) {
    const day = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10);
    let hours = parseInt(timeMatch[1], 10);

    let minutes = 0;
    let isAM = false;

    if (timeMatch[2].toLowerCase() === 'pm') {
      hours += 12;
    }

    return new Date(new Date().getFullYear(), month - 1, day, hours, minutes);
  }

  return null;
}

function orderHours(hours: string[]): string[] {
  return hours.sort((a, b) => {
    const timeA = parseInt(a, 10);
    const timeB = parseInt(b, 10);
    const isAM_A = a.toLowerCase().includes('am');
    const isAM_B = b.toLowerCase().includes('am');

    // Convert hours to 24-hour format for proper comparison
    const convertedA = isAM_A ? timeA : timeA + 12;
    const convertedB = isAM_B ? timeB : timeB + 12;

    return convertedA - convertedB;
  });
}
