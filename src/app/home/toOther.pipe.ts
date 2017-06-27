import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'toOther'})

export class ToOtherPipe implements PipeTransform {
  transform(text: string): string {
    let value : string = (text=='' ? 'Khac' : text)
    value= value.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    return value;
  }
}