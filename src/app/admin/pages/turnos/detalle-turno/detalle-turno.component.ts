import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EspecialidadesService } from 'src/app/services/especialidades.service';
import { ImagesService } from 'src/app/services/images.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-detalle-turno',
  templateUrl: './detalle-turno.component.html',
  styleUrls: ['./detalle-turno.component.scss']
})
export class DetalleTurnoComponent implements OnInit {

  turnoForm: FormGroup;
  isLoading = false;

  turno: any;

  pacientes: any[];
  selectedPaciente: any;

  selectedDateTime: Date;
  
  uploadedFiles: File[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private especialidadesService: EspecialidadesService,
    private turnosService: TurnosService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private imageService: ImagesService
  ) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;

    const turnoId = this.route.snapshot.paramMap.get('id');

    if(turnoId != '-1')
    {
      this.turno = await this.turnosService.getTurnoById(turnoId!);
      console.log(this.turno);

      this.pacientes = await this.userService.getPacientes();
      this.selectedPaciente = this.pacientes.find(paciente => paciente.id === this.turno.data.paciente.id);

      this.selectedDateTime = new Date(this.turno.data.fechaHora.seconds * 1000);

      // Get the time zone offset in minutes
      const timeZoneOffset = this.selectedDateTime.getTimezoneOffset();
      
      // Adjust the date by adding the offset in minutes
      this.selectedDateTime.setMinutes(this.selectedDateTime.getMinutes() - timeZoneOffset);
      
      // Set the date value to the local time zone
      // this.dateControl.setValue(this.selectedDateTime.toISOString().slice(0, 16));
      
      this.turnoForm = this.formBuilder.group({
        paciente: [this.selectedPaciente, Validators.required],
        // especialidad: ['', Validators.required],
        // especialista: ['', Validators.required],
        fechaHora: [this.selectedDateTime.toISOString().slice(0, 16), Validators.required],
        informacion: [this.turno.data.informacion],
        file: ['']
      });
    }
    else
    {
      this.turnoForm = this.formBuilder.group({
        paciente: ['', Validators.required],
        fechaHora: ['', Validators.required],
        informacion: [''],
        file: ['']
      });
    }

    this.isLoading = false;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.turnoForm.get('file')!.setValue(file);
  }

  async saveAppointment() {

    this.turno.data.paciente = this.selectedPaciente;
    this.turno.data.fechaHora = new Date(this.turnoForm.controls['fechaHora'].value);
    this.turno.data.informacion = this.turnoForm.controls['informacion'].value;

    const filePromise = this.imageService.uploadFile(this.turnoForm.get('file')!.value, this.turno.id + "_file").toPromise();

    const fileUrl = await from(filePromise).toPromise();

    this.turno.data.file = fileUrl;

    await this.turnosService.updateTurn(this.turno);
  }
}
