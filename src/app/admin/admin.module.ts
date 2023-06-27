import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegistroAdminComponent } from './pages/registro-admin/registro-admin.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { AdminFooterComponent } from './components/admin-footer/admin-footer.component';
import { ReportsComponent } from './pages/reports/reports.component';

@NgModule({
  declarations: [
    DashboardComponent,
    RegistroAdminComponent,
    TurnosComponent,
    UserListComponent,
    AdminFooterComponent,
    ReportsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
