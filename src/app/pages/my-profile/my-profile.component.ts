import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  user: any;

  daysOfWeek: string[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
  hoursOfDay: string[] = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];
  saturdayHours: string[] = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm']
  availability: { [day: string]: string[] } = {};

  constructor(
    private authService: AuthService,
    private usersService: UserService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.usuarioDB;
    this.user.images = [];

    if (this.user.hasOwnProperty('imagen')) {
      this.user.images.push(this.user.imagen);
    }
    if (this.user.hasOwnProperty('imagen1')) {
      this.user.images.push(this.user.imagen1);
    }
    if (this.user.hasOwnProperty('imagen2')) {
      this.user.images.push(this.user.imagen2);
    }

    if (this.user.horarios) {
      this.availability = this.user.horarios;
    }
  }

  toggleAvailability(day: string, hour: string) {
    if (!this.availability[day]) {
      this.availability[day] = [];
    }

    const index = this.availability[day].indexOf(hour);
    if (index > -1) {
      this.availability[day].splice(index, 1);
    } else {
      this.availability[day].push(hour);
    }

    this.usersService.updateHorario(this.user.id, this.availability);
  }

  isAvailable(day: string, hour: string) {
    return this.availability[day] && this.availability[day].includes(hour);
  }

}
