import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroPacienteComponent } from './pages/registro/registro-paciente/registro-paciente.component';
import { RegistroEspecialistaComponent } from './pages/registro/registro-especialista/registro-especialista.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EspecialidadesSelectorComponent } from './components/especialidades-selector/especialidades-selector.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/enviorments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { RegistroAdminComponent } from './pages/admin/registro-admin/registro-admin.component';
import { RegistroComponent } from './pages/registro/registro/registro.component';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RecaptchaV3Module } from 'ng-recaptcha';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { SolicitarTurnoComponent } from './pages/turnos/solicitar-turno/solicitar-turno.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistroPacienteComponent,
    RegistroEspecialistaComponent,
    NavbarComponent,
    EspecialidadesSelectorComponent,
    UserListComponent,
    DashboardComponent,
    RegistroAdminComponent,
    RegistroComponent,
    MyProfileComponent,
    SolicitarTurnoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    RecaptchaModule,
    RecaptchaFormsModule,
    NgSelectModule
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey
      } as RecaptchaSettings,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
