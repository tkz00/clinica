import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { EspecialidadesService } from 'src/app/services/especialidades.service';
import { LoggerService } from 'src/app/services/logger.service';
import { PdfService } from 'src/app/services/pdf.service';
import { TurnosService } from 'src/app/services/turnos.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  isLoading = false;

  loginLogs: any[] = [];
  turnos: any[] = [];
  especialistas: any[] = [];
  especialidades: any[] = [];

  private chartColors: string[] = [
    'red',
    'blue',
    'green',
    'yellow',
    'orange',
    'purple'
  ];

  // ByEspecialidad
  @ViewChild('byEspecialidadChart') byEspecialidadChart: any;
  public byEspecialidadChartLoadingEl: any;
  byEspecialidadChartRef: any;

  // ByDate
  @ViewChild('byDayChart') byDateChart: any;
  public byDateChartLoadingEl: any;
  byDateChartRef: any;

  // ByEspecialista
  @ViewChild('byEspecialistaChart') byEspecialistaChart: any;
  public byEspecialistaChartLoadingEl: any;
  byEspecialistaChartRef: any;

  // Finalizado
  @ViewChild('finalizadoChart') finalizadoChart: any;
  public finalizadoChartLoadingEl: any;
  finalizadoChartRef: any;

  constructor(
    private loggerService: LoggerService,
    private turnosService: TurnosService,
    private userService: UserService,
    private especialidadesService: EspecialidadesService,
    private pdfService: PdfService
  ) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;

    this.loginLogs = await this.loggerService.getLoginLogs();
    this.turnos = await this.turnosService.getTurnos();
    this.especialistas = await this.userService.getEspecialistas();
    this.especialidades = (await this.especialidadesService.getEspecialidadesAsync()).sort((a, b) => a['name'].localeCompare(b['name']));

    this.generateByEspecialidadChart();
    this.generateByDateChart();
    this.generateEspecialistasChart();
    this.generateFinalizadosChart();

    this.isLoading = false;
  }

  generateByEspecialidadChart() {
    const byEspecialidadChartData = this.especialidades.map(element => {
      const elementNameLower = element.name.toLowerCase();

      return {
        especialidad: element.name,
        count: this.turnos.filter(turno => turno.data.especialidad.name.toLowerCase() === elementNameLower).length
      };
    });

    this.byEspecialidadChartRef = new Chart(this.byEspecialidadChart.nativeElement,
      {
        type: 'pie',
        data: {
          labels: byEspecialidadChartData.map((data: { especialidad: any; }) => data.especialidad),
          datasets: [{
            label: 'Turnos por especialidad',
            data: byEspecialidadChartData.map((data: { count: any; }) => data.count),
            backgroundColor: this.chartColors
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Cantidad de turnos por especialidad'
            }
          }
        }
      }
    );

    this.byEspecialidadChartLoadingEl = this.byEspecialidadChart.legend;
  }

  generateByDateChart() {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dates = [];
    for (let date = new Date(startDate); date <= currentDate; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }

    const byDateChartDate = dates.map(date => {
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

      const count = this.turnos.reduce((acc, turno) => {
        const turnoDate = turno.data.fechaHora.toDate();

        if (turnoDate >= startOfDay && turnoDate < endOfDay) {
          return acc + 1;
        }
        return acc;
      }, 0);

      return { date, count };
    });

    this.byDateChartRef = new Chart(this.byDateChart.nativeElement,
      {
        type: 'bar',
        data: {
          labels: byDateChartDate.map(data => data.date.toLocaleDateString()),
          datasets: [{
            label: 'Turnos por día',
            data: byDateChartDate.map(data => data.count),
            backgroundColor: this.chartColors,
            borderColor: '#FFFFFF',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Cantidad de turnos última semana'
            }
          }
        }
      }
    );

    this.byDateChartLoadingEl = this.byDateChart.legend;
  }

  generateEspecialistasChart() {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const turnos = this.getTurnosBetweenDates(startDate, currentDate);

    const especialistaChartData = this.especialistas.map(element => {
      return {
        especialista: element.nombre + " " + element.apellido,
        count: turnos.filter(turno => turno.data.especialista.id === element.id).length
      };
    });

    this.byEspecialistaChartRef = new Chart(this.byEspecialistaChart.nativeElement,
      {
        type: 'bar',
        data: {
          labels: especialistaChartData.map(data => data.especialista),
          datasets: [{
            label: 'Turnos por especialista',
            data: especialistaChartData.map(data => data.count),
            backgroundColor: this.chartColors,
            borderColor: '#FFFFFF',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Turnos por especialista'
            }
          }
        }
      }
    );

    this.byEspecialistaChartLoadingEl = this.byEspecialistaChart.legend;
  }

  generateFinalizadosChart() {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const turnos = this.getTurnosBetweenDates(startDate, currentDate);

    const especialistaChartData = this.especialistas.map(element => {
      return {
        especialista: element.nombre + " " + element.apellido,
        count: turnos.filter(turno => turno.data.estado === 'realizado' && turno.data.especialista.id === element.id).length
      };
    });

    this.finalizadoChartRef = new Chart(this.finalizadoChart.nativeElement,
      {
        type: 'pie',
        data: {
          labels: especialistaChartData.map(data => data.especialista),
          datasets: [{
            label: 'Turnos finalizados',
            data: especialistaChartData.map(data => data.count),
            backgroundColor: this.chartColors,
            borderColor: '#FFFFFF',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Turnos finalizados'
            }
          }
        }
      }
    );

    this.finalizadoChartLoadingEl = this.finalizadoChart.legend;
  }

  getTurnosBetweenDates(startDate: Date, endDate: Date): any[] {
    return this.turnos.filter(turno => {
      const fechaHora = turno.data.fechaHora.toDate();
      return fechaHora >= startDate && fechaHora <= endDate;
    });
  }

  downloadPDF() {

    let images = [];
    images.push(this.byEspecialidadChartRef.toBase64Image('image/png', 1));
    images.push(this.byDateChartRef.toBase64Image('image/png', 1));
    images.push(this.byEspecialistaChartRef.toBase64Image('image/png', 1));
    images.push(this.finalizadoChartRef.toBase64Image('image/png', 1));
    this.pdfService.downloadReportsPDF(images, this.loginLogs);
  }
}