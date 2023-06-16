import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { fadeInOutAnimation } from '../animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeInOutAnimation]
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
      if (status) {
        const user = this.authService.usuarioDB;
        if (user.type === 'admin') {
          this.isAdmin = true;
          return;
        }
      }
      this.isAdmin = false;
    });
  }
}
