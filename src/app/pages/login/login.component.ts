import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  isLoading = false;

  errorMessage: any;

  selectedUser: string;


  users: { email: string; password: string }[] = [
    { email: 'admin@admin.com', password: '111111' },
    { email: 'especialista@especialista.com', password: '333333' },
    { email: 'sinverif@especialista.com', password: '555555' },
    { email: 'paciente@paciente.com', password: '222222' },
    { email: 'test@test.com', password: '444444' },
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

  onUserSelect() {
    const selectedUser = this.users[parseInt(this.selectedUser!)];
    this.loginForm.get('email')?.setValue(selectedUser.email);
    this.loginForm.get('password')?.setValue(selectedUser.password);
  }
}
