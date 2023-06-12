import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ImagesService } from 'src/app/services/images.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registro-especialista',
  templateUrl: './registro-especialista.component.html',
  styleUrls: ['./registro-especialista.component.scss']
})
export class RegistroEspecialistaComponent implements OnInit {

  registrationForm: FormGroup;
  submitted = false;
  @Output() isLoadingChanged = new EventEmitter<boolean>();
  @Output() goToPacientes = new EventEmitter();

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
      especialidad: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      imagen: ['']
    });
  }

  async onSubmit() {
    this.changeIsLoading(true);
    this.submitted = true;

    if (this.registrationForm.invalid) {
      console.log(this.registrationForm.errors);
      return;
    }

    var newUser = this.registrationForm.value;

    const uid = await this.authService.register(newUser.email, newUser.password);

    const image = this.imageService.uploadImage(this.registrationForm.get('imagen')!.value, uid).toPromise();

    const imageurl = await from(image).toPromise();

    newUser.id = uid;
    newUser.type = 'especialista';
    newUser.verified = false;
    newUser.enabled = false;
    newUser.imagen = imageurl;

    await this.userService.adduser(newUser);

    this.changeIsLoading(false);

    this.router.navigate(['/']);
  }

  onEspecialidadSelected(especialidad: string) {
    this.registrationForm.patchValue({
      especialidad: especialidad
    });
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    this.registrationForm.get('imagen')!.setValue(file);
  }

  changeIsLoading(newValue: boolean) {
    this.isLoadingChanged.emit(newValue);
  }

  changePage() {
    this.goToPacientes.emit();
  }
}
