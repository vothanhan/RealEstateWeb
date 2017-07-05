import { Component, OnInit } from '@angular/core';
import { MenuApiService } from '../menu-api/menu-api.service';
import { HouseService } from '../house/house.service';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'; 

@Component({
  selector: 'dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css'],
  providers : [MenuApiService, HouseService]
})
export class DropdownMenuComponent implements OnInit {
  menu_json   : object;
  transTypes  : string[]=[];
  provinces   : string[]=[];
  countys     : string[]=[];
  wards       : string[]=[];
  htypes      : string[]=[];
  transType   : string = '';
  province    : string = '';
  county      : string = '';
  ward        : string = '';
  htype       : string = '';
  startDate   : string = '';
  endDate     : string = '';
  typeCount   : object = {};
  menuLevel   : object = {
    "all"      : 0,
    "trans"    : 1,
    "htype"    : 1,
    "province" : 2,
    "county"   : 3,
    "ward"     : 4
  };
  hasChanged   : boolean = false;
  graphLevel  : number = 0;
  haveHType : boolean = true;
  dateStep : number=1;
  hasDateStep : boolean=false;
  optionsModel: number[];
  myOptions: IMultiSelectOption[];

  constructor(private menuApiService : MenuApiService, private houseService : HouseService) { 
      this.menuApiService.getMenu().subscribe( res => {
          this.menu_json=res;
          this.loadMenu();
      })
  }

  ngOnInit() {
  }


  isTransAndHouseSet(){
    return this.transType!='' && this.htype!='';
  }

  setHasChanged(val){
    console.log("IN");
    this.hasChanged= val;

  }

  loadMenu(){
      this.transTypes = Object.keys(this.menu_json['menu']);
      this.htypes = this.menu_json['house_type'];
      let arr=[];
      let index=0;
      this.htypes.forEach((item)=>{
        arr.push({"id":index,"name":item});
        index+=1;
      })
      this.myOptions=arr;
      this.htype = '';
      this.changeCount('all');
  }

  setLevel(number){
    this.graphLevel = number;
  }

  resetSelection(level){
    if(level>=3)
    {
      this.transType   = '';
    }
    if (level>=2){
      this.province    = '';
    }
    if (level>=1){
      this.county      = '';
      this.ward        = '';
    }
    if(this.haveHType==false){
      this.htype       = '';
    }
  }

  fillMenu(menu){
      this.setHasChanged(true);
      if(menu=='trans'){
          if (this.transType==''){
            this.provinces=[];
          }
          else
            this.provinces = Object.keys(this.menu_json['menu'][this.transType]);
            this.countys = [];
            this.wards = [];
            this.province = ''
            this.county = '';
            this.ward = '';
      }
      else if (menu == 'province'){
          this.countys = this.province != '' ? Object.keys(this.menu_json['menu'][this.transType][this.province]) : [];
          this.wards = [];
          this.county = ''
          this.ward = '';
      }
      else if(menu == 'county'){
          this.wards = this.county != '' ? Object.keys(this.menu_json['menu'][this.transType][this.province][this.county]) : [];
          this.ward = '';
      }
      this.changeCount(menu);
  }

  changeCount(menu){
    let level= this.menuLevel[menu]
    if (level <= 1){
      if (menu == 'all'){
        this.typeCount['transTypes']=[];
        for( let i = 0; i < this.transTypes.length; i++){
          this.typeCount['transTypes'].push(0);
          this.getCount('' , '', '', '', this.transTypes[i],'transTypes',i);
        }
      }
      if (menu == 'trans' || menu == 'all')
      {
        this.typeCount['htypes']=[];
        for( let i = 0; i < this.htypes.length; i++){
          this.typeCount['htypes'].push(0);
          this.getCount(this.htypes[i], '', '', '', this.transType,'htypes',i);
        }
      }
    }
    
    
    if (this.provinces.length>0 && level < 2){
      this.typeCount['provinces']=[];
      for( let i = 0; i < this.provinces.length; i++){
        this.typeCount['provinces'].push(0);
        this.getCount(this.htype,this.provinces[i], '', '', this.transType,'provinces',i);
      }
    }

    if (this.countys.length>0 && level < 3){
      this.typeCount['countys']=[];
      for( let i = 0; i < this.countys.length; i++){
        this.typeCount['countys'].push(0);
        this.getCount(this.htype,this.province, this.countys[i], '', this.transType,'countys',i);
      }
    }

    if (this.wards.length>0 && level < 4){
      this.typeCount['wards']=[];
      for( let i = 0; i < this.wards.length; i++){
        this.typeCount['wards'].push(0);
        this.getCount(this.htype,this.province, this.county, this.wards[i], this.transType,'wards',i);
      }
    }
  }

  getCount(htype, province, county, ward, transType, arr, i){
    this.houseService.getHouse(htype,province, county, ward, transType,'','', 1).subscribe( res => {
      if(res['err']==false){
        this.typeCount[arr][i]=res['data'];
      }
      else{
        this.typeCount[arr][i]=0;
      }
    });
  }
  getSelected(){
    let ret=''
    this.optionsModel.forEach((item)=>{
      ret+=this.myOptions[item]['name']+";";
    })
    return ret;
  }
}
