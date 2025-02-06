import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstChar'
})
export class FirstCharPipe implements PipeTransform {

  transform(value: string): string {
    return Array.from(value)[0];
  }

}
