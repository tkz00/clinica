import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroPacienteComponent } from './pages/registro-paciente/registro-paciente.component';
import { RegistroEspecialistaComponent } from './pages/registro-especialista/registro-especialista.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { RegistroAdminComponent } from './pages/admin/registro-admin/registro-admin.component';
import { AdminAuthGuard } from './_helpers/adminAuth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro-paciente', component: RegistroPacienteComponent },
  { path: 'registro-especialista', component: RegistroEspecialistaComponent },
  { path: 'admin', component: DashboardComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/user-list', component: UserListComponent },
  { path: 'admin/registro-admin', component: RegistroAdminComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
