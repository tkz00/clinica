import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroPacienteComponent } from './pages/registro-paciente/registro-paciente.component';
import { RegistroEspecialistaComponent } from './pages/registro-especialista/registro-especialista.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistroPacienteComponent,
    RegistroEspecialistaComponent,
    UsuariosComponent,
    NavbarComponent,
    EspecialidadesSelectorComponent,
    UserListComponent,
    DashboardComponent,
    RegistroAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment),
    provideFirebaseApp(() => initializeApp(environment)),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
