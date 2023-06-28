import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-clinical-story',
  templateUrl: './clinical-story.component.html',
  styleUrls: ['./clinical-story.component.scss']
})
export class ClinicalStoryComponent implements OnInit {
  userToShow: any;
  userTurns: any;
  userClinicalStory: any[] = [];

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private turnosService: TurnosService,
    private userService: UserService
  ) { }

  async ngOnInit() {
    this.isLoading = true;

    if (this.authService.usuarioDB.type === 'paciente') {
      this.userToShow = this.authService.usuarioDB;
      this.userTurns = await this.turnosService.getTurnosByPacienteId(this.authService.usuarioDB.id);
    } else {
      const userId = this.route.snapshot.paramMap.get('id');
      this.userToShow = (await this.userService.getUserById(userId!));
      this.userTurns = await this.turnosService.getTurnosByPacienteId(userId!);
    }

    this.userTurns.filter((turn: { data: any; }) => turn.data.clinicalStory && Array.isArray(turn.data.clinicalStory)).forEach((turn: { data: any; }) => {
      turn.data.clinicalStory.forEach((story: any) => {
        story.date = turn.data.fechaHora;
        this.userClinicalStory.push(story);
      });
    });

    this.userClinicalStory.sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());

    this.isLoading = false;
  }
}
