import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }
}
