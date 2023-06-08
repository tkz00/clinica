import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { EspecialidadesService } from 'src/app/services/especialidades.service';

@Component({
  selector: 'app-especialidades-selector',
  templateUrl: './especialidades-selector.component.html',
  styleUrls: ['./especialidades-selector.component.scss']
})
export class EspecialidadesSelectorComponent implements OnInit {

  especialidades: string[] = []; // List of existing especialidades
  filteredEspecialidades: string[] = []; // Filtered especialidades based on search input
  searchInput = new FormControl(); // Search input control

  @Output() especialidadSeleccionada: EventEmitter<any> = new EventEmitter<any>();

  selectedEspecialidad = new FormControl();

  constructor(
    private especialidadService: EspecialidadesService
  ) {
    this.searchInput = new FormControl();
    this.selectedEspecialidad = new FormControl();
  }

  ngOnInit(): void {
    // Fetch the list of especialidades from the database
    this.especialidadService.getEspecialidades().subscribe(
      especialidades => {
        this.especialidades = especialidades.map(especialidad => {
          return especialidad.name.charAt(0).toUpperCase() + especialidad.name.slice(1);
        });
        this.filteredEspecialidades = this.especialidades;
      });
  }

  filterEspecialidades() {
    const filterValue = this.searchInput.value.toLowerCase();
    this.filteredEspecialidades = this.especialidades.filter(especialidad =>
      especialidad.toLowerCase().includes(filterValue)
    );
  }

  createEspecialidad() {
    const newEspecialidad = this.searchInput.value.trim();
    if (newEspecialidad && !this.especialidades.includes(newEspecialidad)) {
      this.especialidadService.newEspecialidad(newEspecialidad);
      this.especialidades.push(newEspecialidad);
      this.searchInput.setValue('');
    }
  }

  onEspecialidadSelected() {
    this.especialidadSeleccionada.emit(this.selectedEspecialidad.value);
  }
}
