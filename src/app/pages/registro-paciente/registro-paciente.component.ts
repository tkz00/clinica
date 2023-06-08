import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ImagesService } from 'src/app/services/images.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.scss']
})
export class RegistroPacienteComponent implements OnInit {

  registrationForm: FormGroup;
  submitted = false;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private imageService: ImagesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{7,8}$')]],
      obraSocial: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      imagen1: ['', Validators.required],
      imagen2: ['', Validators.required]
    });
  }

  async onSubmit() {
    this.isLoading = true;
    this.submitted = true;

    if (this.registrationForm.invalid) {
      console.log("Error inputs");
      return;
    }

    var newUser = this.registrationForm.value;

    const uid = await this.authService.register(newUser.email, newUser.password);

    const image1urlPromise = this.imageService.uploadImage(this.registrationForm.get('imagen1')!.value, uid + "_imagen1").toPromise();
    const image2urlPromise = this.imageService.uploadImage(this.registrationForm.get('imagen2')!.value, uid + "_imagen2").toPromise();

    const image1url = await from(image1urlPromise).toPromise();
    const image2url = await from(image2urlPromise).toPromise();

    newUser.id = uid;
    newUser.type = 'paciente';
    newUser.verified = false;
    newUser.imagen1 = image1url;
    newUser.imagen2 = image2url;

    await this.userService.adduser(newUser);

    this.isLoading = false;

    this.router.navigate(['/']);
  }

  handleFileInputImagen1(event: any) {
    const file = event.target.files[0];
    this.registrationForm.get('imagen1')!.setValue(file);
  }

  handleFileInputImagen2(event: any) {
    const file = event.target.files[0];
    this.registrationForm.get('imagen2')!.setValue(file);
  }
}
