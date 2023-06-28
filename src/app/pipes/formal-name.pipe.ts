import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formalName'
})
export class FormalNamePipe implements PipeTransform {

  transform(value: any) {
    return value.apellido + ", " + value.nombre;
  }

}
