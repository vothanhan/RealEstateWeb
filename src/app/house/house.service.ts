import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'; 

import { House } from './house';

@Injectable()
export class HouseService {

  constructor(private http: Http) { };


  getHouse(houseType : string, province : string, county : string, ward : string, transtype: string, isCount : number): Observable<object>{
      let hv : string = houseType != '' && houseType != undefined ? 'htype='+houseType.replace(' ','%20'):'';
      let pv : string = province != '' && province != undefined ? '&province='+province.replace(' ','%20'):'';
      let cv : string = county != '' && county != undefined ? '&county='+county.replace(' ','%20'):'';
      let wv : string = ward != '' && ward != undefined ? '&ward='+ward.replace(' ','%20'):'';
      let tv : string = transtype != '' && transtype != undefined ? '&transtype='+transtype.replace(' ','%20'):'';
      tv = hv == '' ? tv.slice(1): tv;
      let qmark : string = hv != '' || pv != '' || tv !='' ? '?' : '';
      let count : string = isCount == 1 ? '/count' : isCount==2 ? '/average' : isCount == 3 ? "/htypepercent" : isCount == 4 ? "/trendprice" : isCount == 5 ? "/aggregate":"" ;

      return this.http.get('/api/house'+count+qmark+hv+tv+pv+cv+wv).map((response: Response) =>{
          return response.json()
      }).catch(this.handleError)
  }

  getPostCount(date: string) : Observable<object>{
    return this.http.get('/api/house/countpost?date='+date).map((response: Response) =>{
      return response.json()
    }).catch(this.handleError);
  }

  getCountMenu() : Observable<object>{
    return this.http.get('/api/house/countmenu').map((response: Response) =>{
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
