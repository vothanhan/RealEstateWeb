import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'toOther'})

export class ToOtherPipe implements PipeTransform {
  transform(text: string): string {
    let value : string = (text=='' ? 'Other' : text)
    value= value.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    let temp = value.split(" ");
    if (temp.length == 2){
        if(temp[0]=='Quan'){
            temp[0]='District';
            value = temp.join(" ");
        }
        if(temp[0]=='Phuong'){
            temp[0]='Ward';
            value = temp.join(" ");
        }
    }
    return value;
  }
}