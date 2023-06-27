import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ImagesService } from 'src/app/services/images.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.component.html',
  styleUrls: ['./registro-admin.component.scss']
})
export class RegistroAdminComponent implements OnInit {

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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      imagen: ['', Validators.required],
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

    const image = this.imageService.uploadImage(this.registrationForm.get('imagen')!.value, uid).toPromise();

    const imageurl = await from(image).toPromise();

    newUser.id = uid;
    newUser.type = 'admin';
    newUser.imagen = imageurl;

    await this.userService.adduser(newUser);

    this.isLoading = false;

    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      icon: 'success',
      title: 'Se ha creado el usuario con éxito'
    })

    this.router.navigate(['/admin']);
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    this.registrationForm.get('imagen')!.setValue(file);
  }
}
