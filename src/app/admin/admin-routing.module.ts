import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from './_helpers/adminAuth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegistroAdminComponent } from './pages/registro-admin/registro-admin.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { ReportsComponent } from './pages/reports/reports.component';

const routes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [AdminAuthGuard] },
    { path: 'user-list', component: UserListComponent, canActivate: [AdminAuthGuard] },
    { path: 'turnos', component: TurnosComponent, canActivate: [AdminAuthGuard] },
    { path: 'registro-admin', component: RegistroAdminComponent, canActivate: [AdminAuthGuard] },
    { path: 'reports', component: ReportsComponent, canActivate: [AdminAuthGuard] }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }

