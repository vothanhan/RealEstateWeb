import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'; 

import { House } from './house';

@Injectable()
export class HouseService {

  constructor(private http: Http) { };


  getHouse(houseType, province : string, county : string, ward : string, transtype: string, startDate: string, endDate: string, website:string, project: string, isCount : number): Observable<object>{
      let hv : string = houseType != '' && houseType != undefined ? 'htype='+houseType.replace(' ','%20'):'';
      let pv : string = province != '' && province != undefined ? '&province='+province.replace(' ','%20'):'';
      let cv : string = county != '' && county != undefined ? '&county='+county.replace(' ','%20'):'';
      let wv : string = ward != '' && ward != undefined ? '&ward='+ward.replace(' ','%20'):'';
      let tv : string = transtype != '' && transtype != undefined ? '&transtype='+transtype.replace(' ','%20'):'';
      let sd : string = startDate != '' && startDate!= undefined ? "&startDate="+startDate:"";
      let ed : string = endDate != '' && endDate!= undefined ? "&endDate="+endDate:"";
      let we : string = website != '' && website!= undefined ? "&website="+website:"";
      let pr : string = project != '' && project != undefined ? '&project='+project.replace(' ','%20'):'';
      tv = hv == '' ? tv.slice(1): tv;
      sd = hv == '' && tv == '' ? sd.slice(1):sd;             
      ed = hv == '' && tv == '' && sd == '' ? ed.slice(1):ed;
      we = hv == '' && tv == '' && sd == '' && ed == '' ? we.slice(1) : we;
      pr = hv == '' && tv == '' && sd == '' && ed == '' && we =='' ? pr.slice(1) : pr;
      let qmark : string = hv != '' || pv != '' || tv !='' || sd !='' || ed !='' || we != '' || pr != '' ? '?' : '';
      let apiName : string ;
      switch(isCount){
        case 1: 
          apiName='/count';
          break
        case 2: 
          apiName='/average';
          break;
        case 3 : 
          apiName="/htypepercent";
          break;
        case 4 :
          apiName="/trendprice";
          break;
        case 5 : 
          apiName= "/aggregate";
          break;
        case 6 :
          apiName= "/countpost";
          break;
        default:
          apiName="";
      }

      return this.http.get('/api/house'+apiName+qmark+hv+tv+pv+cv+wv+sd+ed+we+pr).map((response: Response) =>{
          return response.json()
      }).catch(this.handleError)
  }

  getCountMenu(houseType, province : string, county : string, transtype: string, startDate: string, endDate: string, groupBy: string) : Observable<object>{
    let hv : string = houseType != '' && houseType != undefined ? 'htype='+houseType.replace(' ','%20'):'';
    let pv : string = province != '' && province != undefined ? '&province='+province.replace(' ','%20'):'';
    let cv : string = county != '' && county != undefined ? '&county='+county.replace(' ','%20'):'';
    let tv : string = transtype != '' && transtype != undefined ? '&transtype='+transtype.replace(' ','%20'):'';
    let sd : string = startDate != '' && startDate!= undefined ? "&startDate="+startDate:"";
    let ed : string = endDate != '' && endDate!= undefined ? "&endDate="+endDate:"";
    let gb : string = "&groupBy="+groupBy;
    tv = hv == '' ? tv.slice(1): tv;
    sd = hv == '' && tv == '' ? sd.slice(1):sd;
    ed = hv == '' && tv == '' && sd == '' ? ed.slice(1):ed;
    gb = hv == '' && tv == '' && sd == '' && ed =='' ? gb.slice(1):gb;
    let qmark : string = hv != '' || pv != '' || tv !='' || sd !='' || ed !='' || gb !='' ? '?' : '';

    return this.http.get('/api/house/countmenu'+qmark+hv+tv+pv+cv+sd+ed+gb).map((response: Response) =>{
      return response.json();
    }).catch(this.handleError);
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
