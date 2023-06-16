import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { slideInOutAnimation } from '../animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [slideInOutAnimation]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  isLoading = false;

  errorMessage: any;

  selectedUser: string;


  users: { email: string; password: string; imgSrc: string }[] = [
    { email: 'paciente@paciente.com', password: '222222', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/clinica-9f1c7.appspot.com/o/userImages%2Fpaciente1.jpg?alt=media' },
    { email: 'sinverificar@paciente.com', password: '222222', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/clinica-9f1c7.appspot.com/o/userImages%2FjvmEVUi3bvOECbZKl5vYm33VIaq2_imagen1?alt=media&token=7c93d989-5b94-4e68-879d-eb1cb1365892' },
    { email: 'otro@paciente.com', password: '222222', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/clinica-9f1c7.appspot.com/o/userImages%2FXRsnhwJ1mwW3n7MkVnbyBxeuc752_imagen1?alt=media&token=278f8eb0-0b00-4e6e-865b-a5953d9b1026' },
    { email: 'especialista@especialista.com', password: '333333', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/clinica-9f1c7.appspot.com/o/userImages%2Fespecialista1.jpg?alt=media' },
    { email: 'sinverif@especialista.com', password: '555555', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/clinica-9f1c7.appspot.com/o/userImages%2Fespecialista2.jpg?alt=media' },
    { email: 'admin@admin.com', password: '111111', imgSrc: 'https://firebasestorage.googleapis.com/v0/b/clinica-9f1c7.appspot.com/o/userImages%2FXJLAg6pVq6adlyts7kb0mCMUuZ73.jpg?alt=media&token=2b95fe1a-f747-4076-8c2b-2229df0a2ef9' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  async onSubmit() {
    try {
      this.isLoading = true;
      this.submitted = true;

      if (this.loginForm.invalid) {
        console.log("Error inputs");
        return;
      }

      const { email, password } = this.loginForm.value;

      await this.authService.login(email, password);
      this.isLoading = false;

      this.router.navigate(['/']);
    }
    catch (e) {
      console.log(e);
      this.isLoading = false;
      this.errorMessage = e;
    }
  }

  onUserSelect(index: number) {
    const selectedUser = this.users[index];
    this.loginForm.get('email')?.setValue(selectedUser.email);
    this.loginForm.get('password')?.setValue(selectedUser.password);

    const cardElements = document.getElementsByClassName('card');

    for (let i = 0; i < cardElements.length; i++) {
      const element = cardElements[i];
      element.classList.remove('selected');
    }

    document.getElementById('user-card-' + index)?.classList.add('selected');
  }
}
