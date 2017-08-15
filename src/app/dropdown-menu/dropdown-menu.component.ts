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
  projects    : string[]=[];
  transType   : string = '';
  province    : string = '';
  county      : string = '';
  ward        : string = '';
  htype       : string = '';
  startDate   : string = '';
  endDate     : string = '';
  project     : string = '';
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
  haveApart: boolean;
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
      this.transTypes=[];
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
            // this.provinces = Object.keys(this.menu_json['menu'][this.transType]);
            this.provinces = [];
            this.countys = [];
            this.wards = [];
            this.province = ''
            this.county = '';
            this.ward = '';
      }
      else if (menu == 'province'){
          // this.countys = this.province != '' ? Object.keys(this.menu_json['menu'][this.transType][this.province]) : [];
          this.countys = [];
          this.wards = [];
          this.county = ''
          this.ward = '';
      }
      else if(menu == 'county'){
          // this.wards = this.county != '' ? Object.keys(this.menu_json['menu'][this.transType][this.province][this.county]) : [];
          this.wards= [];
          this.ward = '';
      }
      this.changeCount(menu);
      this.getCount(this.htype,this.province,this.county, this.transType,'project','projects');
      this.checkApartment();

  }
  checkApartment(){
    if (this.optionsModel.length == 1 && this.myOptions[this.optionsModel[0]]['name'] == 'Can ho chung cu'){
      this.haveApart = true;
    }
    else{
      this.haveApart = false;
    }
  }
  changeCount(menu){
    let level= this.menuLevel[menu]
    let data;
    if (level <= 1){
      if (menu == 'all'){
        this.typeCount['transaction-type']=[];
        this.getCount('' , '', '', '','transaction-type','transTypes');
        
      }
      // if (menu == 'trans' || menu == 'all')
      if (menu == 'trans')
      {
        this.typeCount['location.province']=[];
        this.getCount('', '', '', this.transType,'location.province','provinces');
      }
    }

    if (menu == 'province' && level < 3){
      this.typeCount['location.county']=[];
      this.getCount(this.htype,this.province, '', this.transType,'location.county','countys');
    }

    if (menu == 'county' && this.countys.length>0 && level < 4){
      this.typeCount['location.ward']=[];
      this.getCount(this.htype,this.province,this.county, this.transType,'location.ward','wards');
    }

    // if (menu == 'ward' && this.wards.length>0 && level < 4){
    //   this.typeCount['location.ward']=[];
    //   // data =this.getCount(this.htype,this.province, this.county, this.transType,'location.ward',"wards");
    // }
  }

  getCount(htype, province, county, transType,arr,target){
    let vm=this;
    this.houseService.getCountMenu(htype,province, county, transType,'','',arr).subscribe( res => {
      if(res['err']==false){
        if (arr!='project'){
          res['data'].forEach((item)=>{
            if(target=='provinces'){
                if (item['_id']== 'ha noi' || item['_id']=='ho chi minh')
                  this.typeCount[arr][item['_id']]=item['count'];
              }
            else{
              this.typeCount[arr][item['_id']]=item['count'];
            }
          })
        }
        if (target!=''){
          let data = vm[target];
          if(target=='provinces'){
            data.push('ha noi');
            data.push('ho chi minh');
          }
          else{
            res['data'].forEach((item)=>{
              data.push(item['_id']);
            })
          }
        }
      }
      else{
        for(let key in this.typeCount[arr]){
          // this.typeCount[arr][key]=0;

        }
        return [];
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
