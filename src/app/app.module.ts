import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RecaptchaV3Module } from 'ng-recaptcha';

import { AppRoutingModule } from './app-routing.module';

import { environment } from 'src/enviorments/environment';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroPacienteComponent } from './pages/registro/registro-paciente/registro-paciente.component';
import { RegistroEspecialistaComponent } from './pages/registro/registro-especialista/registro-especialista.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EspecialidadesSelectorComponent } from './components/especialidades-selector/especialidades-selector.component';
import { RegistroComponent } from './pages/registro/registro/registro.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { SolicitarTurnoComponent } from './pages/turnos/solicitar-turno/solicitar-turno.component';
import { MisTurnosComponent } from './pages/turnos/mis-turnos/mis-turnos.component';
import { FooterComponent } from './components/footer/footer.component';
import { RateComponent } from './pages/turnos/rate/rate.component';
import { SurveyComponent } from './pages/turnos/survey/survey.component';
import { ClinicalStoryModalComponent } from './pages/turnos/clinical-story-modal/clinical-story-modal.component';
import { ClinicalStoryComponent } from './pages/clinical-story/clinical-story.component';
import { PatientListComponent } from './pages/patient-list/patient-list.component';
import { ExcludeFieldsPipePipe } from './pipes/exclude-fields-pipe.pipe';
import { NamePipe } from './pipes/name.pipe';
import { FormalNamePipe } from './pipes/formal-name.pipe';
import { HoverHighlightDirective } from './directives/hover-highlight.directive';
import { LinkDirective } from './directives/link.directive';
import { AvailableDateTimeDirective } from './directives/available-date-time.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistroPacienteComponent,
    RegistroEspecialistaComponent,
    NavbarComponent,
    EspecialidadesSelectorComponent,
    RegistroComponent,
    MyProfileComponent,
    SolicitarTurnoComponent,
    MisTurnosComponent,
    FooterComponent,
    RateComponent,
    SurveyComponent,
    ClinicalStoryModalComponent,
    ClinicalStoryComponent,
    PatientListComponent,
    ExcludeFieldsPipePipe,
    NamePipe,
    FormalNamePipe,
    HoverHighlightDirective,
    LinkDirective,
    AvailableDateTimeDirective,
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
    NgSelectModule,
    NgbModule,
    NgbTooltipModule,
    BrowserAnimationsModule
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
