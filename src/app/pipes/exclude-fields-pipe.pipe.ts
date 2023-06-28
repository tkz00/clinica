import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excludeFieldsPipe'
})
export class ExcludeFieldsPipePipe implements PipeTransform {

  transform(value: any): any {
    if (value && typeof value === 'object') {
      const excludedFields = ['date', 'altura', 'peso', 'fiebre', 'presionSanguinea'];
      return Object.entries(value).filter(([key]) => !excludedFields.includes(key));
    }
    return [];
  }

}
