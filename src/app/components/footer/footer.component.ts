import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  isAdmin = false;
  isEspecialista = false;

  constructor(
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    this.authService.isLoggedIn$.subscribe((status: boolean) => {
      if (status) {
        const user = this.authService.usuarioDB;
        if (user.type === 'admin') {
          this.isAdmin = true;
          return;
        }
        if (user.type === 'especialista') {
          this.isEspecialista = true;
          return;
        }
      }
      this.isAdmin = false;
      this.isEspecialista = false;
    });
  }
}
