export class House {
  id: string;
  price: number;
  area: string;
  location: {
      province:string;
      county:string;
      ward: string;
  }
  "post-time":{
    "date": Date,
    "weekday": number
  }
  type: string;
  transtype: string;
}