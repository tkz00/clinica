import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excludeFieldsPipe'
})
export class ExcludeFieldsPipePipe implements PipeTransform {

  transform(value: any): any {
    if (value && typeof value === 'object') {
      const excludedFields = ['date', 'height', 'weight', 'fever', 'bloodPressure'];
      return Object.entries(value).filter(([key]) => !excludedFields.includes(key));
    }
    return [];
  }

}
