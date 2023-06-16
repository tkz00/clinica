import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro/registro.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { SolicitarTurnoComponent } from './pages/turnos/solicitar-turno/solicitar-turno.component';
import { MisTurnosComponent } from './pages/turnos/mis-turnos/mis-turnos.component';

import { AuthGuard } from './_helpers/auth.guard';
import { PacienteAuthGuard } from './_helpers/pacienteAuth.guard';
import { ClinicalStoryComponent } from './pages/clinical-story/clinical-story.component';
import { PatientListComponent } from './pages/patient-list/patient-list.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'mi-perfil', component: MyProfileComponent, canActivate: [AuthGuard] },
  { path: 'solicitar-turnos', component: SolicitarTurnoComponent, canActivate: [PacienteAuthGuard] }, // NO ESPECIALISTA AUTH
  { path: 'mis-turnos', component: MisTurnosComponent, canActivate: [AuthGuard] },
  { path: 'pacientes', component: PatientListComponent, canActivate: [AuthGuard] },
  { path: 'historia-clinica', component: ClinicalStoryComponent, canActivate: [AuthGuard] },
  { path: 'historia-clinica/:id', component: ClinicalStoryComponent, canActivate: [AuthGuard] },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
