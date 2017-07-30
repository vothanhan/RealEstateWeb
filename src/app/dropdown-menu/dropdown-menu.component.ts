import { Component, OnInit } from '@angular/core';
import { MenuApiService } from '../menu-api/menu-api.service';
import { HouseService } from '../house/house.service';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import {IMultiSelectSettings} from "angular-2-dropdown-multiselect";
import {IMultiSelectTexts} from "angular-2-dropdown-multiselect";


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
  optionsModel: number[]=[];
  sourceModel: number[]=[];
  haveWebsite: boolean = false;
  myOptions: IMultiSelectOption[];
  sourceOptions: IMultiSelectOption[];
  mySettings: IMultiSelectSettings = {
  };
  myTexts: IMultiSelectTexts={};

  constructor(private menuApiService : MenuApiService, private houseService : HouseService) { 
      this.menuApiService.getMenu().subscribe( res => {
          this.menu_json=res;
          this.loadMenu();
      })
  }

  ngOnInit() {
  }


  isTransAndHouseSet(){
    return this.transType!='' && this.optionsModel.length>0;
  }

  setHasChanged(val){
    this.hasChanged= val;
  }

  loadMenu(){
      this.transTypes = Object.keys(this.menu_json['menu']);
      this.htypes = this.menu_json['house_type'];
      let arr = [];
      let websiteArr = [];
      let index=0;
      this.htypes.forEach((item)=>{
        arr.push({"id":index,"name":item});
        index+=1;
      })
      index=0;
      this.menu_json['website'].forEach((item)=>{
        websiteArr.push({"id":index,"name":item});
        index+=1
      });
      this.myOptions=arr;
      this.sourceOptions=websiteArr;
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
        this.typeCount['transaction-type']=[];
        for( let i = 0; i < this.transTypes.length; i++){
          this.typeCount['transaction-type'][this.transTypes[i]]=0;
        }
        this.getCount('' , '', '', '','transaction-type');
      }
      if (menu == 'trans' || menu == 'all')
      {
        this.typeCount['house-type']=[];
        for( let i = 0; i < this.htypes.length; i++){
          this.typeCount['house-type'][this.htypes[i]]=0;
        }
        this.getCount('', '', '', this.transType,'house-type');
      }
    }
    
    
    if (this.provinces.length>0 && level < 2){
      this.typeCount['location.province']=[];
      for( let i = 0; i < this.provinces.length; i++){
        this.typeCount['location.province'][this.provinces[i]]=0;
      }
      this.getCount(this.htype,'', '', this.transType,'location.province');
    }

    if (this.countys.length>0 && level < 3){
      this.typeCount['location.county']=[];
      for( let i = 0; i < this.countys.length; i++){
        this.typeCount['location.county'][this.countys[i]]=0;
        
      }
      this.getCount(this.htype,this.province,"", this.transType,'location.county');
    }

    if (this.wards.length>0 && level < 4){
      this.typeCount['location.ward']=[];
      for( let i = 0; i < this.wards.length; i++){
        this.typeCount['location.ward'][this.wards[i]]=0;
      }
      this.getCount(this.htype,this.province, this.county, this.transType,'location.ward');
    }
  }

  getCount(htype, province, county, transType,arr){
    this.houseService.getCountMenu(htype,province, county, transType,'','',arr).subscribe( res => {
      if(res['err']==false){
        res['data'].forEach((item)=>{
          this.typeCount[arr][item['_id']]=item['count'];
        })
      }
      else{
        for(let key in this.typeCount[arr]){
          this.typeCount[arr][key]=0;
        }
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
  getWebsiteSelected(){
    let ret=''
    this.sourceModel.forEach((item)=>{
      ret+=this.sourceOptions[item]['name']+";";
    })
    return ret;
  }
}
