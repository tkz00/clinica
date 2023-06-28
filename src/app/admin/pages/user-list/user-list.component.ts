import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UserService } from 'src/app/services/user.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  isLoading = false;
  fileUrl: any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private turnosService: TurnosService
  ) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.users = await this.userService.getUsers();

    this.users.forEach(user => {
      user.images = [];
      if (user.hasOwnProperty('imagen')) {
        user.images.push(user.imagen);
      }
      if (user.hasOwnProperty('imagen1')) {
        user.images.push(user.imagen1);
      }
      if (user.hasOwnProperty('imagen2')) {
        user.images.push(user.imagen2);
      }
    });

    this.isLoading = false;
  }

  async onEnabledChange(newValue: boolean, userId: string) {
    await this.userService.setEnable(newValue, userId);
  }

  downloadUsersExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const url = window.URL.createObjectURL(excelBlob);
    window.open(url);
  }

  async downloadUserTurns(user: any) {
    let turns = []
    if (user.type === 'especialista') {
      turns = await this.turnosService.getTurnosByEspecialistaId(user.id);
    }
    else {
      turns = await this.turnosService.getTurnosByPacienteId(user.id);
    }

    let formattedTurns: any[] = [];

    turns.forEach(turn => {
      let formattedTurn: {
        paciente: string;
        edad: any;
        email_paciente: any;
        especialidad: any;
        especialista: string;
        email_especialista: any;
        estado: any;
        fecha_y_hora: any;
        review?: any;
      } = {
        paciente: `${turn.data.paciente.apellido}, ${turn.data.paciente.nombre}`,
        edad: turn.data.paciente.edad,
        email_paciente: turn.data.paciente.email,
        especialidad: turn.data.especialidad.name,
        especialista: `${turn.data.especialista.apellido}, ${turn.data.especialista.nombre}`,
        email_especialista: turn.data.especialista.email,
        estado: turn.data.estado,
        fecha_y_hora: turn.data.fechaHora.toDate()
      };

      if (turn.data.review) {
        formattedTurn.review = turn.data.review;
      }

      formattedTurns.push(formattedTurn);
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedTurns);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const url = window.URL.createObjectURL(excelBlob);
    window.open(url);
  }
}
