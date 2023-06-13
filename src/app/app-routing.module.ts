import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro/registro.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { SolicitarTurnoComponent } from './pages/turnos/solicitar-turno/solicitar-turno.component';
import { MisTurnosComponent } from './pages/turnos/mis-turnos/mis-turnos.component';

import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { RegistroAdminComponent } from './pages/admin/registro-admin/registro-admin.component';
import { TurnosComponent } from './pages/admin/turnos/turnos.component';

import { AuthGuard } from './_helpers/auth.guard';
import { AdminAuthGuard } from './_helpers/adminAuth.guard';
import { PacienteAuthGuard } from './_helpers/pacienteAuth.guard';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'mi-perfil', component: MyProfileComponent, canActivate: [AuthGuard] },
  { path: 'solicitar-turnos', component: SolicitarTurnoComponent, canActivate: [PacienteAuthGuard] }, // NO ESPECIALISTA AUTH
  { path: 'mis-turnos', component: MisTurnosComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: DashboardComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/user-list', component: UserListComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/turnos', component: TurnosComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/registro-admin', component: RegistroAdminComponent, canActivate: [AdminAuthGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
