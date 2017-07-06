import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appRemoveChart]'
})
export class RemoveChartDirective {

  constructor( private el: ElementRef) { }
  @Input('clearID') clearID : string;
  @HostListener ("click") onClick() {
      if (document.getElementById(this.clearID)!=null){
          document.getElementById(this.clearID).innerHTML="";
      }
      
  }

}
