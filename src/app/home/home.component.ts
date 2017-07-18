import { Component, OnInit } from '@angular/core';
import { HouseService } from '../house/house.service';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { AfterViewInit, ViewChild } from '@angular/core';
import { RemoveChartDirective } from './remove-chart.directive';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'; 

declare var Plotly : any;
declare var AmCharts : any;
declare var d3 : any;
declare var science : any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ HouseService]
})
export class HomeComponent implements OnInit {
  graphType : string ;
  countyIDDict : object = {
    "Hoc Mon": "HCM-0",
    "Quan 12": "HCM-1",
    "Quan 5": "HCM-2",
    "Quan 8": "HCM-3",
    "Can Gio": "HCM-4",
    "Nha Be": "HCM-5",
    "Quan 2": "HCM-6",
    "Quan 9": "HCM-7",
    "Thu Duc": "HCM-8",
    "Binh Chanh": "HCM-9",
    "Cu Chi": "HCM-10",
    "Binh Tan": "HCM-11",
    "Tan Phu": "HCM-12",
    "Go Vap": "HCM-13",
    "Binh Thanh": "HCM-14",
    "Tan Binh": "HCM-15",
    "Phu Nhuan": "HCM-16",
    "Quan 11": "HCM-17",
    "Quan 10": "HCM-18",
    "Quan 7": "HCM-19",
    "Quan 6": "HCM-20",
    "Quan 4": "HCM-21",
    "Quan 3": "HCM-22",
    "Quan 1": "HCM-23",
  };

  hcmDataProviders: object = {
      "map": "hcmHigh",
      "getAreasFromMap": true,
      "images": [ {
        "svgPath": "M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466zM27.436,17.39c0.001,0.002,0.004,0.002,0.005,0.004c-0.022,0.187-0.054,0.37-0.085,0.554c-0.015-0.012-0.034-0.025-0.047-0.036c-0.103-0.09-0.254-0.128-0.318-0.115c-0.157,0.032,0.229,0.305,0.267,0.342c0.009,0.009,0.031,0.03,0.062,0.058c-1.029,5.312-5.709,9.338-11.319,9.338c-4.123,0-7.736-2.18-9.776-5.441c0.123-0.016,0.24-0.016,0.28-0.076c0.051-0.077,0.102-0.241,0.178-0.331c0.077-0.089,0.165-0.229,0.127-0.292c-0.039-0.064,0.101-0.344,0.088-0.419c-0.013-0.076-0.127-0.256,0.064-0.407s0.394-0.382,0.407-0.444c0.012-0.063,0.166-0.331,0.152-0.458c-0.012-0.127-0.152-0.28-0.24-0.318c-0.09-0.037-0.28-0.05-0.356-0.151c-0.077-0.103-0.292-0.203-0.368-0.178c-0.076,0.025-0.204,0.05-0.305-0.015c-0.102-0.062-0.267-0.139-0.33-0.189c-0.065-0.05-0.229-0.088-0.305-0.088c-0.077,0-0.065-0.052-0.178,0.101c-0.114,0.153,0,0.204-0.204,0.177c-0.204-0.023,0.025-0.036,0.141-0.189c0.113-0.152-0.013-0.242-0.141-0.203c-0.126,0.038-0.038,0.115-0.241,0.153c-0.203,0.036-0.203-0.09-0.076-0.115s0.355-0.139,0.355-0.19c0-0.051-0.025-0.191-0.127-0.191s-0.077-0.126-0.229-0.291c-0.092-0.101-0.196-0.164-0.299-0.204c-0.09-0.579-0.15-1.167-0.15-1.771c0-2.844,1.039-5.446,2.751-7.458c0.024-0.02,0.048-0.034,0.069-0.036c0.084-0.009,0.31-0.025,0.51-0.059c0.202-0.034,0.418-0.161,0.489-0.153c0.069,0.008,0.241,0.008,0.186-0.042C8.417,8.2,8.339,8.082,8.223,8.082S8.215,7.896,8.246,7.896c0.03,0,0.186,0.025,0.178,0.11C8.417,8.091,8.471,8.2,8.625,8.167c0.156-0.034,0.132-0.162,0.102-0.195C8.695,7.938,8.672,7.853,8.642,7.794c-0.031-0.06-0.023-0.136,0.14-0.153C8.944,7.625,9.168,7.708,9.16,7.573s0-0.28,0.046-0.356C9.253,7.142,9.354,7.09,9.299,7.065C9.246,7.04,9.176,7.099,9.121,6.972c-0.054-0.127,0.047-0.22,0.108-0.271c0.02-0.015,0.067-0.06,0.124-0.112C11.234,5.257,13.524,4.466,16,4.466c3.213,0,6.122,1.323,8.214,3.45c-0.008,0.022-0.01,0.052-0.031,0.056c-0.077,0.013-0.166,0.063-0.179-0.051c-0.013-0.114-0.013-0.331-0.102-0.203c-0.089,0.127-0.127,0.127-0.127,0.191c0,0.063,0.076,0.127,0.051,0.241C23.8,8.264,23.8,8.341,23.84,8.341c0.036,0,0.126-0.115,0.239-0.141c0.116-0.025,0.319-0.088,0.332,0.026c0.013,0.115,0.139,0.152,0.013,0.203c-0.128,0.051-0.267,0.026-0.293-0.051c-0.025-0.077-0.114-0.077-0.203-0.013c-0.088,0.063-0.279,0.292-0.279,0.292s-0.306,0.139-0.343,0.114c-0.04-0.025,0.101-0.165,0.203-0.228c0.102-0.064,0.178-0.204,0.14-0.242c-0.038-0.038-0.088-0.279-0.063-0.343c0.025-0.063,0.139-0.152,0.013-0.216c-0.127-0.063-0.217-0.14-0.318-0.178s-0.216,0.152-0.305,0.204c-0.089,0.051-0.076,0.114-0.191,0.127c-0.114,0.013-0.189,0.165,0,0.254c0.191,0.089,0.255,0.152,0.204,0.204c-0.051,0.051-0.267-0.025-0.267-0.025s-0.165-0.076-0.268-0.076c-0.101,0-0.229-0.063-0.33-0.076c-0.102-0.013-0.306-0.013-0.355,0.038c-0.051,0.051-0.179,0.203-0.28,0.152c-0.101-0.051-0.101-0.102-0.241-0.051c-0.14,0.051-0.279-0.038-0.355,0.038c-0.077,0.076-0.013,0.076-0.255,0c-0.241-0.076-0.189,0.051-0.419,0.089s-0.368-0.038-0.432,0.038c-0.064,0.077-0.153,0.217-0.19,0.127c-0.038-0.088,0.126-0.241,0.062-0.292c-0.062-0.051-0.33-0.025-0.367,0.013c-0.039,0.038-0.014,0.178,0.011,0.229c0.026,0.05,0.064,0.254-0.011,0.216c-0.077-0.038-0.064-0.166-0.141-0.152c-0.076,0.013-0.165,0.051-0.203,0.077c-0.038,0.025-0.191,0.025-0.229,0.076c-0.037,0.051,0.014,0.191-0.051,0.203c-0.063,0.013-0.114,0.064-0.254-0.025c-0.14-0.089-0.14-0.038-0.178-0.012c-0.038,0.025-0.216,0.127-0.229,0.012c-0.013-0.114,0.025-0.152-0.089-0.229c-0.115-0.076-0.026-0.076,0.127-0.025c0.152,0.05,0.343,0.075,0.622-0.013c0.28-0.089,0.395-0.127,0.28-0.178c-0.115-0.05-0.229-0.101-0.406-0.127c-0.179-0.025-0.42-0.025-0.7-0.127c-0.279-0.102-0.343-0.14-0.457-0.165c-0.115-0.026-0.813-0.14-1.132-0.089c-0.317,0.051-1.193,0.28-1.245,0.318s-0.128,0.19-0.292,0.318c-0.165,0.127-0.47,0.419-0.712,0.47c-0.241,0.051-0.521,0.254-0.521,0.305c0,0.051,0.101,0.242,0.076,0.28c-0.025,0.038,0.05,0.229,0.191,0.28c0.139,0.05,0.381,0.038,0.393-0.039c0.014-0.076,0.204-0.241,0.217-0.127c0.013,0.115,0.14,0.292,0.114,0.368c-0.025,0.077,0,0.153,0.09,0.14c0.088-0.012,0.559-0.114,0.559-0.114s0.153-0.064,0.127-0.166c-0.026-0.101,0.166-0.241,0.203-0.279c0.038-0.038,0.178-0.191,0.014-0.241c-0.167-0.051-0.293-0.064-0.115-0.216s0.292,0,0.521-0.229c0.229-0.229-0.051-0.292,0.191-0.305c0.241-0.013,0.496-0.025,0.444,0.051c-0.05,0.076-0.342,0.242-0.508,0.318c-0.166,0.077-0.14,0.216-0.076,0.292c0.063,0.076,0.09,0.254,0.204,0.229c0.113-0.025,0.254-0.114,0.38-0.101c0.128,0.012,0.383-0.013,0.42-0.013c0.039,0,0.216,0.178,0.114,0.203c-0.101,0.025-0.229,0.013-0.445,0.025c-0.215,0.013-0.456,0.013-0.456,0.051c0,0.039,0.292,0.127,0.19,0.191c-0.102,0.063-0.203-0.013-0.331-0.026c-0.127-0.012-0.203,0.166-0.241,0.267c-0.039,0.102,0.063,0.28-0.127,0.216c-0.191-0.063-0.331-0.063-0.381-0.038c-0.051,0.025-0.203,0.076-0.331,0.114c-0.126,0.038-0.076-0.063-0.242-0.063c-0.164,0-0.164,0-0.164,0l-0.103,0.013c0,0-0.101-0.063-0.114-0.165c-0.013-0.102,0.05-0.216-0.013-0.241c-0.064-0.026-0.292,0.012-0.33,0.088c-0.038,0.076-0.077,0.216-0.026,0.28c0.052,0.063,0.204,0.19,0.064,0.152c-0.14-0.038-0.317-0.051-0.419,0.026c-0.101,0.076-0.279,0.241-0.279,0.241s-0.318,0.025-0.318,0.102c0,0.077,0,0.178-0.114,0.191c-0.115,0.013-0.268,0.05-0.42,0.076c-0.153,0.025-0.139,0.088-0.317,0.102s-0.204,0.089-0.038,0.114c0.165,0.025,0.418,0.127,0.431,0.241c0.014,0.114-0.013,0.242-0.076,0.356c-0.043,0.079-0.305,0.026-0.458,0.026c-0.152,0-0.456-0.051-0.584,0c-0.127,0.051-0.102,0.305-0.064,0.419c0.039,0.114-0.012,0.178-0.063,0.216c-0.051,0.038-0.065,0.152,0,0.204c0.063,0.051,0.114,0.165,0.166,0.178c0.051,0.013,0.215-0.038,0.279,0.025c0.064,0.064,0.127,0.216,0.165,0.178c0.039-0.038,0.089-0.203,0.153-0.166c0.064,0.039,0.216-0.012,0.331-0.025s0.177-0.14,0.292-0.204c0.114-0.063,0.05-0.063,0.013-0.14c-0.038-0.076,0.114-0.165,0.204-0.254c0.088-0.089,0.253-0.013,0.292-0.115c0.038-0.102,0.051-0.279,0.151-0.267c0.103,0.013,0.243,0.076,0.331,0.076c0.089,0,0.279-0.14,0.332-0.165c0.05-0.025,0.241-0.013,0.267,0.102c0.025,0.114,0.241,0.254,0.292,0.279c0.051,0.025,0.381,0.127,0.433,0.165c0.05,0.038,0.126,0.153,0.152,0.254c0.025,0.102,0.114,0.102,0.128,0.013c0.012-0.089-0.065-0.254,0.025-0.242c0.088,0.013,0.191-0.026,0.191-0.026s-0.243-0.165-0.331-0.203c-0.088-0.038-0.255-0.114-0.331-0.241c-0.076-0.127-0.267-0.153-0.254-0.279c0.013-0.127,0.191-0.051,0.292,0.051c0.102,0.102,0.356,0.241,0.445,0.33c0.088,0.089,0.229,0.127,0.267,0.242c0.039,0.114,0.152,0.241,0.19,0.292c0.038,0.051,0.165,0.331,0.204,0.394c0.038,0.063,0.165-0.012,0.229-0.063c0.063-0.051,0.179-0.076,0.191-0.178c0.013-0.102-0.153-0.178-0.203-0.216c-0.051-0.038,0.127-0.076,0.191-0.127c0.063-0.05,0.177-0.14,0.228-0.063c0.051,0.077,0.026,0.381,0.051,0.432c0.025,0.051,0.279,0.127,0.331,0.191c0.05,0.063,0.267,0.089,0.304,0.051c0.039-0.038,0.242,0.026,0.294,0.038c0.049,0.013,0.202-0.025,0.304-0.05c0.103-0.025,0.204-0.102,0.191,0.063c-0.013,0.165-0.051,0.419-0.179,0.546c-0.127,0.127-0.076,0.191-0.202,0.191c-0.06,0-0.113,0-0.156,0.021c-0.041-0.065-0.098-0.117-0.175-0.097c-0.152,0.038-0.344,0.038-0.47,0.19c-0.128,0.153-0.178,0.165-0.204,0.114c-0.025-0.051,0.369-0.267,0.317-0.331c-0.05-0.063-0.355-0.038-0.521-0.038c-0.166,0-0.305-0.102-0.433-0.127c-0.126-0.025-0.292,0.127-0.418,0.254c-0.128,0.127-0.216,0.038-0.331,0.038c-0.115,0-0.331-0.165-0.331-0.165s-0.216-0.089-0.305-0.089c-0.088,0-0.267-0.165-0.318-0.165c-0.05,0-0.19-0.115-0.088-0.166c0.101-0.05,0.202,0.051,0.101-0.229c-0.101-0.279-0.33-0.216-0.419-0.178c-0.088,0.039-0.724,0.025-0.775,0.025c-0.051,0-0.419,0.127-0.533,0.178c-0.116,0.051-0.318,0.115-0.369,0.14c-0.051,0.025-0.318-0.051-0.433,0.013c-0.151,0.084-0.291,0.216-0.33,0.216c-0.038,0-0.153,0.089-0.229,0.28c-0.077,0.19,0.013,0.355-0.128,0.419c-0.139,0.063-0.394,0.204-0.495,0.305c-0.102,0.101-0.229,0.458-0.355,0.623c-0.127,0.165,0,0.317,0.025,0.419c0.025,0.101,0.114,0.292-0.025,0.471c-0.14,0.178-0.127,0.266-0.191,0.279c-0.063,0.013,0.063,0.063,0.088,0.19c0.025,0.128-0.114,0.255,0.128,0.369c0.241,0.113,0.355,0.217,0.418,0.367c0.064,0.153,0.382,0.407,0.382,0.407s0.229,0.205,0.344,0.293c0.114,0.089,0.152,0.038,0.177-0.05c0.025-0.09,0.178-0.104,0.355-0.104c0.178,0,0.305,0.04,0.483,0.014c0.178-0.025,0.356-0.141,0.42-0.166c0.063-0.025,0.279-0.164,0.443-0.063c0.166,0.103,0.141,0.241,0.23,0.332c0.088,0.088,0.24,0.037,0.355-0.051c0.114-0.09,0.064-0.052,0.203,0.025c0.14,0.075,0.204,0.151,0.077,0.267c-0.128,0.113-0.051,0.293-0.128,0.47c-0.076,0.178-0.063,0.203,0.077,0.278c0.14,0.076,0.394,0.548,0.47,0.638c0.077,0.088-0.025,0.342,0.064,0.495c0.089,0.151,0.178,0.254,0.077,0.331c-0.103,0.075-0.28,0.216-0.292,0.47s0.051,0.431,0.102,0.521s0.177,0.331,0.241,0.419c0.064,0.089,0.14,0.305,0.152,0.445c0.013,0.14-0.024,0.306,0.039,0.381c0.064,0.076,0.102,0.191,0.216,0.292c0.115,0.103,0.152,0.318,0.152,0.318s0.039,0.089,0.051,0.229c0.012,0.14,0.025,0.228,0.152,0.292c0.126,0.063,0.215,0.076,0.28,0.013c0.063-0.063,0.381-0.077,0.546-0.063c0.165,0.013,0.355-0.075,0.521-0.19s0.407-0.419,0.496-0.508c0.089-0.09,0.292-0.255,0.268-0.356c-0.025-0.101-0.077-0.203,0.024-0.254c0.102-0.052,0.344-0.152,0.356-0.229c0.013-0.077-0.09-0.395-0.115-0.457c-0.024-0.064,0.064-0.18,0.165-0.306c0.103-0.128,0.421-0.216,0.471-0.267c0.051-0.053,0.191-0.267,0.217-0.433c0.024-0.167-0.051-0.369,0-0.457c0.05-0.09,0.013-0.165-0.103-0.268c-0.114-0.102-0.089-0.407-0.127-0.457c-0.037-0.051-0.013-0.319,0.063-0.345c0.076-0.023,0.242-0.279,0.344-0.393c0.102-0.114,0.394-0.47,0.534-0.496c0.139-0.025,0.355-0.229,0.368-0.343c0.013-0.115,0.38-0.547,0.394-0.635c0.013-0.09,0.166-0.42,0.102-0.497c-0.062-0.076-0.559,0.115-0.622,0.141c-0.064,0.025-0.241,0.127-0.446,0.113c-0.202-0.013-0.114-0.177-0.127-0.254c-0.012-0.076-0.228-0.368-0.279-0.381c-0.051-0.012-0.203-0.166-0.267-0.317c-0.063-0.153-0.152-0.343-0.254-0.458c-0.102-0.114-0.165-0.38-0.268-0.559c-0.101-0.178-0.189-0.407-0.279-0.572c-0.021-0.041-0.045-0.079-0.067-0.117c0.118-0.029,0.289-0.082,0.31-0.009c0.024,0.088,0.165,0.279,0.19,0.419s0.165,0.089,0.178,0.216c0.014,0.128,0.14,0.433,0.19,0.47c0.052,0.038,0.28,0.242,0.318,0.318c0.038,0.076,0.089,0.178,0.127,0.369c0.038,0.19,0.076,0.444,0.179,0.482c0.102,0.038,0.444-0.064,0.508-0.102s0.482-0.242,0.635-0.255c0.153-0.012,0.179-0.115,0.368-0.152c0.191-0.038,0.331-0.177,0.458-0.28c0.127-0.101,0.28-0.355,0.33-0.444c0.052-0.088,0.179-0.152,0.115-0.253c-0.063-0.103-0.331-0.254-0.433-0.268c-0.102-0.012-0.089-0.178-0.152-0.178s-0.051,0.088-0.178,0.153c-0.127,0.063-0.255,0.19-0.344,0.165s0.026-0.089-0.113-0.203s-0.192-0.14-0.192-0.228c0-0.089-0.278-0.255-0.304-0.382c-0.026-0.127,0.19-0.305,0.254-0.19c0.063,0.114,0.115,0.292,0.279,0.368c0.165,0.076,0.318,0.204,0.395,0.229c0.076,0.025,0.267-0.14,0.33-0.114c0.063,0.024,0.191,0.253,0.306,0.292c0.113,0.038,0.495,0.051,0.559,0.051s0.33,0.013,0.381-0.063c0.051-0.076,0.089-0.076,0.153-0.076c0.062,0,0.177,0.229,0.267,0.254c0.089,0.025,0.254,0.013,0.241,0.179c-0.012,0.164,0.076,0.305,0.165,0.317c0.09,0.012,0.293-0.191,0.293-0.191s0,0.318-0.012,0.433c-0.014,0.113,0.139,0.534,0.139,0.534s0.19,0.393,0.241,0.482s0.267,0.355,0.267,0.47c0,0.115,0.025,0.293,0.103,0.293c0.076,0,0.152-0.203,0.24-0.331c0.091-0.126,0.116-0.305,0.153-0.432c0.038-0.127,0.038-0.356,0.038-0.444c0-0.09,0.075-0.166,0.255-0.242c0.178-0.076,0.304-0.292,0.456-0.407c0.153-0.115,0.141-0.305,0.446-0.305c0.305,0,0.278,0,0.355-0.077c0.076-0.076,0.151-0.127,0.19,0.013c0.038,0.14,0.254,0.343,0.292,0.394c0.038,0.052,0.114,0.191,0.103,0.344c-0.013,0.152,0.012,0.33,0.075,0.33s0.191-0.216,0.191-0.216s0.279-0.189,0.267,0.013c-0.014,0.203,0.025,0.419,0.025,0.545c0,0.053,0.042,0.135,0.088,0.21c-0.005,0.059-0.004,0.119-0.009,0.178C27.388,17.153,27.387,17.327,27.436,17.39zM20.382,12.064c0.076,0.05,0.102,0.127,0.152,0.203c0.052,0.076,0.14,0.05,0.203,0.114c0.063,0.064-0.178,0.14-0.075,0.216c0.101,0.077,0.151,0.381,0.165,0.458c0.013,0.076-0.279,0.114-0.369,0.102c-0.089-0.013-0.354-0.102-0.445-0.127c-0.089-0.026-0.139-0.343-0.025-0.331c0.116,0.013,0.141-0.025,0.267-0.139c0.128-0.115-0.189-0.166-0.278-0.191c-0.089-0.025-0.268-0.305-0.331-0.394c-0.062-0.089-0.014-0.228,0.141-0.331c0.076-0.051,0.279,0.063,0.381,0c0.101-0.063,0.203-0.14,0.241-0.165c0.039-0.025,0.293,0.038,0.33,0.114c0.039,0.076,0.191,0.191,0.141,0.229c-0.052,0.038-0.281,0.076-0.356,0c-0.075-0.077-0.255,0.012-0.268,0.152C20.242,12.115,20.307,12.013,20.382,12.064zM16.875,12.28c-0.077-0.025,0.025-0.178,0.102-0.229c0.075-0.051,0.164-0.178,0.241-0.305c0.076-0.127,0.178-0.14,0.241-0.127c0.063,0.013,0.203,0.241,0.241,0.318c0.038,0.076,0.165-0.026,0.217-0.051c0.05-0.025,0.127-0.102,0.14-0.165s0.127-0.102,0.254-0.102s0.013,0.102-0.076,0.127c-0.09,0.025-0.038,0.077,0.113,0.127c0.153,0.051,0.293,0.191,0.459,0.279c0.165,0.089,0.19,0.267,0.088,0.292c-0.101,0.025-0.406,0.051-0.521,0.038c-0.114-0.013-0.254-0.127-0.419-0.153c-0.165-0.025-0.369-0.013-0.433,0.077s-0.292,0.05-0.395,0.05c-0.102,0-0.228,0.127-0.253,0.077C16.875,12.534,16.951,12.306,16.875,12.28zM17.307,9.458c0.063-0.178,0.419,0.038,0.355,0.127C17.599,9.675,17.264,9.579,17.307,9.458zM17.802,18.584c0.063,0.102-0.14,0.431-0.254,0.407c-0.113-0.027-0.076-0.318-0.038-0.382C17.548,18.545,17.769,18.529,17.802,18.584zM13.189,12.674c0.025-0.051-0.039-0.153-0.127-0.013C13.032,12.71,13.164,12.725,13.189,12.674zM20.813,8.035c0.141,0.076,0.339,0.107,0.433,0.013c0.076-0.076,0.013-0.204-0.05-0.216c-0.064-0.013-0.104-0.115,0.062-0.203c0.165-0.089,0.343-0.204,0.534-0.229c0.19-0.025,0.622-0.038,0.774,0c0.152,0.039,0.382-0.166,0.445-0.254s-0.203-0.152-0.279-0.051c-0.077,0.102-0.444,0.076-0.521,0.051c-0.076-0.025-0.686,0.102-0.812,0.102c-0.128,0-0.179,0.152-0.356,0.229c-0.179,0.076-0.42,0.191-0.509,0.229c-0.088,0.038-0.177,0.19-0.101,0.216C20.509,7.947,20.674,7.959,20.813,8.035zM14.142,12.674c0.064-0.089-0.051-0.217-0.114-0.217c-0.12,0-0.178,0.191-0.103,0.254C14.002,12.776,14.078,12.763,14.142,12.674zM14.714,13.017c0.064,0.025,0.114,0.102,0.165,0.114c0.052,0.013,0.217,0,0.167-0.127s-0.167-0.127-0.204-0.127c-0.038,0-0.203-0.038-0.267,0C14.528,12.905,14.65,12.992,14.714,13.017zM11.308,10.958c0.101,0.013,0.217-0.063,0.305-0.101c0.088-0.038,0.216-0.114,0.216-0.229c0-0.114-0.025-0.216-0.077-0.267c-0.051-0.051-0.14-0.064-0.216-0.051c-0.115,0.02-0.127,0.14-0.203,0.14c-0.076,0-0.165,0.025-0.14,0.114s0.077,0.152,0,0.19C11.117,10.793,11.205,10.946,11.308,10.958zM11.931,10.412c0.127,0.051,0.394,0.102,0.292,0.153c-0.102,0.051-0.28,0.19-0.305,0.267s0.216,0.153,0.216,0.153s-0.077,0.089-0.013,0.114c0.063,0.025,0.102-0.089,0.203-0.089c0.101,0,0.304,0.063,0.406,0.063c0.103,0,0.267-0.14,0.254-0.229c-0.013-0.089-0.14-0.229-0.254-0.28c-0.113-0.051-0.241-0.28-0.317-0.331c-0.076-0.051,0.076-0.178-0.013-0.267c-0.09-0.089-0.153-0.076-0.255-0.14c-0.102-0.063-0.191,0.013-0.254,0.089c-0.063,0.076-0.14-0.013-0.217,0.012c-0.102,0.035-0.063,0.166-0.012,0.229C11.714,10.221,11.804,10.361,11.931,10.412zM24.729,17.198c-0.083,0.037-0.153,0.47,0,0.521c0.152,0.052,0.241-0.202,0.191-0.267C24.868,17.39,24.843,17.147,24.729,17.198zM20.114,20.464c-0.159-0.045-0.177,0.166-0.304,0.306c-0.128,0.141-0.267,0.254-0.317,0.241c-0.052-0.013-0.331,0.089-0.242,0.279c0.089,0.191,0.076,0.382-0.013,0.472c-0.089,0.088,0.076,0.342,0.052,0.482c-0.026,0.139,0.037,0.229,0.215,0.229s0.242-0.064,0.318-0.229c0.076-0.166,0.088-0.331,0.164-0.47c0.077-0.141,0.141-0.434,0.179-0.51c0.038-0.075,0.114-0.316,0.102-0.457C20.254,20.669,20.204,20.489,20.114,20.464zM10.391,8.802c-0.069-0.06-0.229-0.102-0.306-0.11c-0.076-0.008-0.152,0.06-0.321,0.06c-0.168,0-0.279,0.067-0.347,0C9.349,8.684,9.068,8.65,9.042,8.692C9.008,8.749,8.941,8.751,9.008,8.87c0.069,0.118,0.12,0.186,0.179,0.178s0.262-0.017,0.288,0.051C9.5,9.167,9.569,9.226,9.712,9.184c0.145-0.042,0.263-0.068,0.296-0.119c0.033-0.051,0.263-0.059,0.263-0.059S10.458,8.861,10.391,8.802z",
        "id": "backButton",
        "label": "Back to country map",
        "rollOverColor": "#9a7bca",
        "labelRollOverColor": "#9a7bca",
        "useTargetsZoomValues": false,
        "left": 30,
        "bottom": 30,
        "labelFontSize": 15,
        "selectable": true
      } ]
    };

  vnDataProviders: object = {
      "map": "vietnamHigh",
      "getAreasFromMap":true,
      "areas": [ {
        "id": "VN-SG",
        "linkToObject": this.hcmDataProviders,
        "passZoomValuesToTarget": false,
      }]
    };

  graphLevel= {
    "priceDistribute": 0,
    "itemDensityGraph":1,
    "priceProb": 0,
    "itemDensity": 2,
    "priceAverage":1,
    "meanPrice": 1,
    "postPerDay": 0,
    "hTypePercent":0,
    "priceTrend":0,
    "boxPlotPrice":1,
    "priceScatter":0,
    "predictPrice":0

  }

  isLong : boolean;
  map : any;
  mapObject : any;
  isRender : boolean = false;
  processActive : boolean = true;
  isNotPredict : boolean = true;
  predictInfo:any;

  @ViewChild(DropdownMenuComponent)

  private menuComponent: DropdownMenuComponent;

  constructor(private houseService : HouseService) {
      
  }

  ngOnInit() {
    this.drawMap(false)
  }
  
  chooseGraph(id){
    this.graphType=id;
    this.graphChange();
  }

  // Draw graph according to button
  processButton(){
    this.isLong = false;
    this.menuComponent.setHasChanged(false);  // make button disabled if graph is not change, to not rerender the same graph
    this.isRender=true;
    this.processActive=false;
    if (this.graphType == 'priceDistribute' || this.graphType == 'priceProb' || this.graphType == "predictPrice"){
      this.drawDistributeGraph();
    }
    else if (this.graphType == 'itemDensity' || this.graphType == "itemDensityGraph"){
      this.drawItemCountGraph();  
    }
    else if (this.graphType == 'priceAverage' ){
      if(this.menuComponent.isTransAndHouseSet()==false){
        alert("Must select transaction type and house type!");
        this.processActive=true;
      }
      else{
        this.drawMap(true);
        this.drawAverageMap();
      }
    }
    else if (this.graphType == 'meanPrice'){
      this.drawMedianPrice();
    }
    else if (this.graphType == 'postPerDay'){
      this.drawUploadTendency();
    }
    else if (this.graphType == "hTypePercent"){
      this.drawHouseTypePieChart();
    }
    else if (this.graphType == "priceTrend"){
      this.drawTrendOfPrice();
    }
    else if (this.graphType == 'boxPlotPrice'){
      this.drawMedianPrice();
    }
    else if (this.graphType == "priceScatter"){
      this.drawScatterPrice();
    }
  }

  graphChange (){
    this.processActive=true;

    this.isNotPredict= this.graphType != "predictPrice";
    this.menuComponent.setLevel(this.graphLevel[this.graphType]);
    if(this.graphType == 'hTypePercent'){
      this.menuComponent.haveHType = false;
    }
    else{
      this.menuComponent.haveHType = true;
    }
    if(this.graphType == 'priceTrend' || this.graphType =='postPerDay'){
      this.menuComponent.hasDateStep=true;
    }
    else {
      this.menuComponent.hasDateStep=false;
    }
    this.menuComponent.resetSelection(this.graphLevel[this.graphType]);
  }


  drawItemCountGraph () {
    let vm=this;
    let count1=0;
    let dataProviders = { };
    let mapName = '';
    if (vm.graphType == 'itemDensityGraph'){
      this.houseService.getHouse(this.menuComponent.getSelected(), this.menuComponent.province, this.menuComponent.county, '', this.menuComponent.transType,this.menuComponent.startDate,this.menuComponent.endDate, 5)
      .subscribe( res => {
        console.log(res['data'])
        let dataProvider=res['data'];
        dataProvider.forEach((item) => {
          item['_id']=item['_id'].replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
        })
        dataProvider.sort((a,b) => {
          return a['count']-b['count'];
        })
        let chart = AmCharts.makeChart("chartdiv", {
              "type": "serial",
              "dataProvider": dataProvider,
              "valueAxes": [{
                  "unit": " listing(s)",
                  "position": "left",
                  "title": "Count",
                  "minimum":0
              }],
              "maxSelectedSeries": 20,
              "startDuration": 1,
              "mouseWheelScrollEnabled": true,
              "graphs": [{
                  "balloonText": "Number of listing in [[category]]: <b>[[value]]</b>",
                  "fillAlphas": 0.9,
                  "lineAlpha": 0.2,
                  "title": "Count",
                  "type": "column",
                  "valueField": "count"
              }],
              "chartScrollbar": {
                //"graph": "Not set",
                "backgroundColor":"#2f373e",
                "graphType": "smoothedLine",
                "resizeEnabled": false,
                "scrollbarHeight": 15,
                "scrollDuration": 0,
                "updateOnReleaseOnly": true
              },
              "plotAreaFillAlphas": 0.1,
              "categoryField": "_id",
              "categoryAxis": {
                  "gridPosition": "start",
                  "labelRotation":45
              },
              "export": {
                "enabled": true
               }
        });
      })
    }
    else
    {
      let province = "";
      dataProviders=vm.map.dataProvider;
      if(vm.map.dataProvider['map']=='hcmHigh')
      {
        province = "ho chi minh";
        dataProviders=vm.hcmDataProviders;
      }
      this.houseService.getHouse(this.menuComponent.getSelected(), province, this.menuComponent.county, '', this.menuComponent.transType,this.menuComponent.startDate,this.menuComponent.endDate, 5)
      .subscribe( res => {
        if(res['err']==true){
          return
        }
        let data={}
        res['data'].forEach((item)=>{
          data[item['_id']]=item['count'];
        })
        for(var i = 0 ; i < dataProviders['areas'].length;i++){
          let county=dataProviders['areas'][i]['title'].toLowerCase().latinise();
          county = county == "ha tay" ? "ha noi 2": county;
          county = county.replace("–"," ");
          let countyData=data[county];

          if (countyData== undefined)
          {
            countyData=0;
          }
          dataProviders['areas'][i]['value']=countyData;
          dataProviders['areas'][i]['balloonText']='[[title]]: [[value]] listing(s)';
          dataProviders['images']=[];
        }
        this.map.dataProvider=dataProviders;
        this.map.validateNow();
      });
    }
  }

  drawAverageMap(){
    let count1=0;
    let dataProviders = { };
    let province=""
    let mapName = '';
    // if (this.map.dataProvider['map']=='vietnamHigh'){
    //   this.map.dataProvider=this.hcmDataProviders;
    //   this.map.validateNow();
    // }
    dataProviders=this.map.dataProvider;
    if(this.map.dataProvider['map'] == 'hcmHigh'){
      province='ho chi minh';
      mapName = "hcmHigh";
      dataProviders= this.hcmDataProviders;
    }

    
    this.houseService.getHouse(this.menuComponent.getSelected(), province, "", '', this.menuComponent.transType,this.menuComponent.startDate,this.menuComponent.endDate, 2)
      .subscribe( res => {
        if (res['err']==true){
          return;
        }
        else{
          for(var i = 0 ; i < dataProviders['areas'].length;i++){
            let county=dataProviders['areas'][i]['title'].toLowerCase();
            let countyData=res['data'][county];
            dataProviders['areas'][i]['value']=countyData['mean'];
            dataProviders['areas'][i]['balloonText']='[[title]]: [[value]] VND';
            dataProviders['images']=[];
          }
          this.map.dataProvider=dataProviders;
          this.map.validateNow();
        }
    });
  }

  drawMap (haveLegend = false){

    let legend = {
        "right": 10,
        "enabled" : haveLegend
      };

    let vm=this;

    let mapObject= {
      "type": "map",
      "colorSteps": 10,
      //"backgroundColor": "#666666",
      //"backgroundAlpha": 1,
      "dataProvider": this.vnDataProviders,
      "areasSettings": {
      "autoZoom": true
      },
      "listeners": [ {
        "event": "homeButtonClicked",
        "method": handleGoHome
      }, {
        "event": "clickMapObject",
        "method": handleMapObjectClick
      }, {
        "event": "dataUpdated",
        "method": catchDataUpdate,
      } ],
      "export": {
        "enabled": true
      },
      "valueLegend": legend,
    };

    this.map = AmCharts.makeChart( "chartdiv", mapObject);

    function handleGoHome() {
      if(vm.graphType=='itemDensity'){
        vm.map.dataProvider = vm.vnDataProviders;
        vm.map.validateNow();
      }
      
    }

    function handleMapObjectClick( event ) {
      if ( event.mapObject.id == "backButton" ) {
        handleGoHome();
      }
    }

    function catchDataUpdate( event){
      if (vm.map.dataProvider['map']=='hcmHigh' && vm.isRender==true && vm.graphType=='itemDensity'){
        vm.isRender=false;
        vm.drawItemCountGraph();
      }
        
    }
  }

  drawDistributeGraph(){
    this.houseService.getHouse(this.menuComponent.getSelected(),this.menuComponent.province, this.menuComponent.county, 
      this.menuComponent.ward, this.menuComponent.transType,this.menuComponent.startDate,this.menuComponent.endDate, 0).subscribe( res => {
        let priceDist : number[] =[];
        let min: number = res['data'].length > 0 ? res['data'][0]['price'] : 0 , max : number = 0;
        for(let i in res['data']){
          if (res['data'][i]['price']!= undefined)
          {
            priceDist.push(res['data'][i]['price'])
          }
          min = res['data'][i]['price'] < min ? res['data'][i]['price'] : min;
          max = res['data'][i]['price'] > max ? res['data'][i]['price'] : max;
        }
        
        if(this.graphType=='priceDistribute'){
          this.drawHistogram(priceDist);
        }
        else{
          this.drawProbability(min,max,priceDist);
        }
    });
  }

  drawProbability(min,max,priceDist){
    let numHistBins = 15;
    var calcHistBinAutomatic = false; // if true, the number of bins are calculated automatically and
    let showKDP = this.graphType == 'priceProb' ? true : false; // show the kernel density plot?
    let bandwidth; // bandwith (smoothing constant) h of the kernel density estimato
    // if( calcHistBinAutomatic == true) {
    //   numHistBins = Math.ceil(Math.sqrt(priceDist.length));  // global variable
    // } 
    // the histogram function
    let histogram
    // the histogram function
    histogram = d3.layout.histogram()
      .frequency(false)
      .bins(numHistBins);
    //.bins(x.ticks(500));
    
    let data = histogram(priceDist);
    let maxY=data[0]['y']
    for( let i=0;i<data.length;i++){
      maxY= maxY < data[i]['y'] ? data[i]['y'] : maxY;
    }

    let margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 1600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom
    // the x-scale parameters
    let x = d3.scale.linear()
        .domain([min, max])
        .range([0, width])
    
    // bandwidth= (max-min)/((x.ticks(numHistBins)).length*2)
    bandwidth = 1.06 * d3.deviation(priceDist,function(item){return item;}) * Math.pow(priceDist.length,-1/5);
    let bins=x.ticks(numHistBins);
    bins.unshift(0);
    let kde = this.kernelDensityEstimator(this.epanechnikovKernel(bandwidth), bins);


    let datum = kde(priceDist);
    let MaxY=datum[0];
    let lastMax;
    let maxYDatum=datum[0][1]
    for(let i=1;i<datum.length;i++){
      MaxY = datum[i][1] > maxYDatum ? datum[i]:MaxY;
      maxYDatum = datum[i][1] > maxYDatum ? datum[i][1] : maxYDatum;
    }
    lastMax= MaxY[1]==datum[0][1] ? datum[1]:datum[0];
    for(let i=0;i<datum.length;i++){
      lastMax= lastMax[1]<datum[i][1] && datum[i][1]!=MaxY[1]?datum[i]:lastMax;
    }
    if(this.graphType=="priceProb")
    {
      maxY = showKDP == true ? maxYDatum : maxY;

      // the y-scale parameters
      let y = d3.scale.linear()
          .domain([0, maxY])
          .range([height, 0])
      let xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
      let yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
      let line = d3.svg.line()
          .interpolate("basis")
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      //var kde = kernelDensityEstimator(epanechnikovKernel(7), x.ticks(100));

      //alert("kde is " + kde.toSource());
      let svg = d3.select("#chartdiv").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      // draw the background
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -30)
          .style("text-anchor", "end")
          .text("Price")
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);
      // draw the histogram and kernel density plot 
        // calculate the number of histogram bins
      
      
      //console.log(svg.datum(kde(priceDist)))
      if (showKDP == false){
        svg.selectAll(".bar")
          .data(data)
          .enter().insert("rect", ".axis")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.x) + 1; })
            .attr("y", function(d) { return y(d.y); })
            .attr("width", x(data[0].dx + data[0].x) - x(data[0].x) - 1)
            .attr("height", function(d) {return height-y(d.y); });
      }
      // show the kernel density plot
      if(showKDP == true) {
        svg.append("path")
          .datum(datum)
          .attr("class", "line")
          .attr("d", line);
        }
    }
    else if(this.graphType=="predictPrice"){
      let predict=[MaxY[0]];
      console.log(MaxY[1]/2);
      console.log(MaxY[1]-lastMax[1]);
      if((MaxY[1]-lastMax[1])<(MaxY[1])/2){
        predict.push(lastMax[0]);
      }
      let prediction="";
      if(predict.length==1){
        prediction="Price range: " + min.toLocaleString() + " VND - " + max.toLocaleString() + " VND. Most likely price range: " 
                   + predict[0].toLocaleString()+"\xB1"+parseInt(bandwidth).toLocaleString()+" VND";
      }
      else{
        prediction="Price range: " + min.toLocaleString() + " VND - " + max.toLocaleString() + " VND. Most likely price range: " 
                   + predict[0].toLocaleString()+"\xB1"+parseInt(bandwidth).toLocaleString()+" VND and "+predict[1].toLocaleString()+"\xB1"+parseInt(bandwidth).toLocaleString()+"VND";
      }
      this.predictInfo=prediction;
    }
    
    
  }
  kernelDensityEstimator(kernel, x) {

      return function(sample) {
        return x.map(function(x) {
        //console.log(x + " ... " + d3.mean(sample, function(v) { return kernel(x - v); }));    
        return [x, d3.mean(sample, function(v) { return kernel(x - v); })];
        });
      };
    }
  epanechnikovKernel(bandwith) {
    return function(u) {
      //return Math.abs(u /= bandwith) <= 1 ? .75 * (1 - u * u) / bandwith : 0;

      if(Math.abs(u = u /  bandwith) <= 1) {
       return 0.75 * (1 - u * u);
      } else return 0;
    };
  }

  drawHistogram(x){
    var data = [
      {
        x: x,
        type: 'histogram',
      marker: {
        color: 'rgba(100,250,100,0.7)',
      },
      }
    ];

    var line = [{
      type: "line",
      x0:0,
      y0:100,
      line: {
        color : "rgba(255,255,255,1)",
        width:4
      }
    }]

    var layout = {
      bargap: 0.05, 
      barmode: "overlay", 
      title: "Price distribution", 
      xaxis: {title: "Price"}, 
      yaxis: {title: "Count"}
    }
    Plotly.newPlot('chartdiv', data,layout);
  }

  drawMedianPrice(){
    let province = this.menuComponent.province;
    let dataProvider = [];
    let totalMean=0;
    let totalMedian = 0;
    let zeroCount=0;
    let vm = this;

    this.houseService.getHouse(this.menuComponent.getSelected(), province, '', '', this.menuComponent.transType,this.menuComponent.startDate,this.menuComponent.endDate, 2)
          .subscribe( res => {
            if (res['err']==true){
              return;
            }

            let countyList=Object.keys(res['data']);
            for(let i=0;i<countyList.length;i++){

              let county=countyList[i];


              dataProvider.push({"county": county,"mean" : res['data'][county]['mean'],"median" : res['data'][county]['median'],
                "firstQuartile":res['data'][county]['firstQuartile'],"thirdQuartile" : res['data'][county]['thirdQuartile'],
                "minimum": res['data'][county]['minimum'], "maximum" : res['data'][county]['maximum']});
              if (res['data'][county]['mean']==0 || res['data'][county]['mean']==null){
                zeroCount+=1;
              }
              totalMean+=res['data'][county]['mean'];
              totalMedian+=res['data'][county]['median'];
            }
            dataProvider.sort(function(a : any ,b : any){
              return b.mean-a.mean;
            })
            let chart : any;
            if (vm.graphType == 'meanPrice'){
              chart = AmCharts.makeChart("chartdiv", {
                  "theme": "light",
                  "type": "serial",
                  "dataProvider": dataProvider,
                  "valueAxes": [{
                      "unit": "VND",
                      "position": "left",
                      "title": "Price",
                      "guides": [{
                          "inside": true,
                          "lineAlpha": 1,
                          "lineColor":"#FF0000",
                          "above" : true,
                          "lineThickness":4,
                          "value": totalMean/(countyList.length-zeroCount)
                      },
                      {
                          "inside": true,
                          "above" : true,
                          "lineColor":"#3EDB25",
                          "lineThickness":2,
                          "lineAlpha": 1,
                          "value": totalMedian/(countyList.length-zeroCount)
                      }],
                  }],
                  "legend": {
                    "equalWidths": false,
                    "data":[
                      {
                        "title": "Mean",
                        "color": "#FF0000"
                      },
                      {
                        "title": "Median",
                        "color": "#3EDB25"
                      }
                    ],
                    "position": "top",
                    "valueAlign": "left",
                    "valueWidth": 100
                  },
                  "startDuration": 1,
                  "graphs": [{
                      "balloonText": "Mean price in [[category]]: <b>[[value]]</b>",
                      "fillAlphas": 0.9,
                      "lineAlpha": 0.2,
                      "title": "Mean",
                      "type": "column",
                      "valueField": "mean"
                  }, {
                      "balloonText": "Median price in [[category]]: <b>[[value]]</b>",
                      "fillAlphas": 0.9,
                      "lineAlpha": 0.2,
                      "title": "Median",
                      "type": "column",
                      "clustered":false,
                      "columnWidth":0.5,
                      "valueField": "median"
                  }],
                  "plotAreaFillAlphas": 0.1,
                  "categoryField": "county",
                  "categoryAxis": {
                      "gridPosition": "start",
                      "labelRotation":45
                  },
                  "export": {
                    "enabled": true
                   }
              });
            }
            else if (vm.graphType == "boxPlotPrice"){
              chart = AmCharts.makeChart( "chartdiv", {
                "type": "serial",
                "theme": "light",
                "valueAxes": [ {
                  "position": "left"
                } ],
                "graphs": [ {
                  "id": "g1",
                  "proCandlesticks": true,
                  "balloonText": "1<sup>st</sup> Quartile:<b>[[firstQuartile]]</b><br>3<sup>rd</sup> Quartile:<b>[[thirdQuartile]]</b><br>Minimum:<b>[[minimum]]</b><br>Maximum:<b>[[maximum]]</b><br>",
                  "closeField": "thirdQuartile",
                  "fillColors": "#db4c3c",
                  "highField": "maximum",
                  "lineColor": "#db4c3c",
                  "lineAlpha": 1,
                  "lowField": "minimum",
                  "openField": "firstQuartile",
                  "title": "Price:",
                  "type": "candlestick",
                  "valueField": "thirdQuartile",
                  "columnWidth":0.7
                },{
                  "type": "column",
                  "columnWidth": 0.7,
                  "valueField": "maximum",
                  "openField": "maximum",
                  "lineColor": "#e62e00",
                  "lineThickness": 3,
                  "showBalloon": false,
                  "clustered": false
                },{
                  "type": "column",
                  "columnWidth": 0.7,
                  "valueField": "minimum",
                  "openField": "minimum",
                  "lineColor": "#e62e00",
                  "lineThickness": 3,
                  "showBalloon": false,
                  "clustered": false
                },{
                  "type": "column",
                  "columnWidth": 0.7,
                  "valueField": "median",
                  "openField": "median",
                  "lineColor": "#e62e00",
                  "lineThickness": 3,
                  "showBalloon": false,
                  "clustered": false
                } ],
                "chartScrollbar": {
                  "graph": "g1",
                  "graphType": "line",
                  "scrollbarHeight": 30
                },
                "chartCursor": {
                  "valueLineEnabled": true,
                  "valueLineBalloonEnabled": true
                },
                "categoryField": "county",
                "categoryAxis": {
                  "labelRotation":45
                },
                "dataProvider":dataProvider,
                "export": {
                    "enabled": true
                   }
              });
            }
            
            var chartScrollbar = new AmCharts.ChartScrollbar();
            chart.addChartScrollbar(chartScrollbar);


    });
  }

  drawUploadTendency(){

    this.houseService.getHouse(this.menuComponent.getSelected(), this.menuComponent.province, this.menuComponent.county, this.menuComponent.ward, this.menuComponent.transType,this.menuComponent.startDate,this.menuComponent.endDate, 6)
    .subscribe( res => {
      if(res['err']==true){
        return;
      }
      let dateList=res['data'];
      dateList.sort((a,b)=>{
        let t1=new Date(a['_id']);
        let t2=new Date(b['_id']);
        return t1.getTime()-t2.getTime();
      })

      var chart = AmCharts.makeChart("chartdiv", {
          "type": "serial",
          "theme": "light",
          "marginRight": 40,
          "marginLeft": 40,
          "autoMarginOffset": 20,
          "mouseWheelZoomEnabled":true,
          "dataDateFormat": "YYYY-MM-DD",
          "valueAxes": [{
              "id": "v1",
              "axisAlpha": 0,
              "position": "left",
              "ignoreAxisWidth":true,
              "baseValue":5000
          }],
          "balloon": {
              "borderThickness": 1,
              "shadowAlpha": 0
          },
          "graphs": [{
              "id": "g1",
              "balloon":{
                "drop":true,
                "adjustBorderColor":false,
                "color":"#ffffff"
              },
              "bullet": "round",
              "bulletBorderAlpha": 1,
              "bulletColor": "#FFFFFF",
              "bulletSize": 5,
              "hideBulletsCount": 50,
              "lineThickness": 2,
              "title": "red line",
              "useLineColorForBulletBorder": true,
              "valueField": "count",
              "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
          }],
          "chartScrollbar": {
              "graph": "g1",
              "oppositeAxis":false,
              "offset":30,
              "scrollbarHeight": 80,
              "backgroundAlpha": 0,
              "selectedBackgroundAlpha": 0.1,
              "selectedBackgroundColor": "#888888",
              "graphFillAlpha": 0,
              "graphLineAlpha": 0.5,
              "selectedGraphFillAlpha": 0,
              "selectedGraphLineAlpha": 1,
              "autoGridCount":true,
              "color":"#AAAAAA"
          },
          "chartCursor": {
              "pan": true,
              "valueLineEnabled": true,
              "valueLineBalloonEnabled": true,
              "cursorAlpha":1,
              "cursorColor":"#258cbb",
              "limitToGraph":"g1",
              "valueLineAlpha":0.2,
              "valueZoomable":true
          },
          "valueScrollbar":{
            "oppositeAxis":false,
            "offset":50,
            "scrollbarHeight":10
          },
          "categoryField": "_id",
          "categoryAxis": {
              "parseDates": true,
              "dashLength": 1,
              "minorGridEnabled": true
          },
          "export": {
              "enabled": true
          },
          "dataProvider":dateList
      });
      chart.addListener("rendered", function(){
        chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
      });
    });
  }

  nextDate(date,step){
    let dateList= date.split('-').map( x => {return parseInt(x)});
    dateList[0]+=step;
    if(dateList[1]==1 || dateList[1]== 3 || dateList[1]==5 || dateList[1]==7 || dateList[1]==8 || dateList[1]==10 || dateList[1]==12){
      if (dateList[0]>=32){
        dateList[0]=dateList[0]-31;
        dateList[1]+=1;
      }
    }
    else if(dateList[1]==4 || dateList[1]== 6 || dateList[1]==9 || dateList[1]==11){
      if (dateList[0]>=31){
        dateList[0]=dateList[0]-30;
        dateList[1]+=1;
      }
    }
    else if(dateList[1]==2){
      if (dateList[2]%4!=0){
        if (dateList[0]>=29){
          dateList[0]=dateList[0]-28;
          dateList[1]+=1;
        }
      }
      else{
        if (dateList[0]>=30){
          dateList[0]=dateList[0]-29;
          dateList[1]+=1;
        }
      }
    }

    if(dateList[1]>=13){
      dateList[1]=1;
      dateList[2]+=1;
    }
    dateList[0]=('0'+dateList[0]).slice(-2);
    dateList[1]=('0'+dateList[1]).slice(-2);
    return dateList.join('-')
  }

  drawHouseTypePieChart(){
    this.houseService.getHouse(this.menuComponent.getSelected(), this.menuComponent.province, this.menuComponent.county, 
      this.menuComponent.ward, this.menuComponent.transType,this.menuComponent.startDate,this.menuComponent.endDate, 3)
      .subscribe( res =>{
        if(res['err']==true){
          console.log("error");
        }
        else{
          var chart = AmCharts.makeChart("chartdiv", {
            "type": "pie",
            "startDuration": 0,
             "theme": "light",
            "addClassNames": true,
            "legend":{
               "position":"right",
              "marginRight":100,
              "autoMargins":false
            },
            "defs": {
              "filter": [{
                "id": "shadow",
                "width": "200%",
                "height": "200%",
                "feOffset": {
                  "result": "offOut",
                  "in": "SourceAlpha",
                  "dx": 0,
                  "dy": 0
                },
                "feGaussianBlur": {
                  "result": "blurOut",
                  "in": "offOut",
                  "stdDeviation": 5
                },
                "feBlend": {
                  "in": "SourceGraphic",
                  "in2": "blurOut",
                  "mode": "normal"
                }
              }]
            },
            "dataProvider": res['data'],
            "valueField": "count",
            "titleField": "_id",
            "export": {
              "enabled": true
            }
          });

          chart.addListener("init", handleInit);

          chart.addListener("rollOverSlice", function(e) {
            handleRollOver(e);
          });

          var handleInit = () => {
            chart.legend.addListener("rollOverItem", handleRollOver);
          }

          var  handleRollOver = (e) => {
            var wedge = e.dataItem.wedge.node;
            wedge.parentNode.appendChild(wedge);
          }
        }
      })
  }

  drawTrendOfPrice(){
    let dateStep=this.menuComponent.dateStep;
    this.houseService.getHouse(this.menuComponent.getSelected(),this.menuComponent.province, this.menuComponent.county, 
      this.menuComponent.ward, this.menuComponent.transType,this.menuComponent.startDate,this.menuComponent.endDate, 4).subscribe( res => {
        let timeData=res['data']
        
        if (res['err']==true){
          console.log("ERROR");
          return;
        }
        let nextDate=new Date(timeData[0]['date']);
        nextDate.setDate(nextDate.getDate() + dateStep);
        let endDate=timeData[timeData.length-1]['date'];
        let showData=[timeData[0]]
        showData[showData.length-1]['dateString']=showData[showData.length-1]['dateString'].split('-').reverse().join("-");
        let date=new Date();
        for(var i =0; i< timeData.length; i++){
          date= new Date(timeData[i]['date']);
          if (date.getTime()-nextDate.getTime()<0){
            showData[showData.length-1]['count']+=timeData[i]['count'];
            showData[showData.length-1]['total']+=timeData[i]['total'];
            showData[showData.length-1]['list']= showData[showData.length-1]['list'].concat(timeData[i]['list']);
          }
          else{
            let quartiles=this.getQuartile(showData[showData.length-1]['list']);
            showData[showData.length-1]['firstQuartile'] = quartiles['fQ'];
            showData[showData.length-1]['thirdQuartile'] = quartiles['tQ'];
            showData[showData.length-1]['median'] = quartiles['median'];
            if(date==nextDate){
              showData.push(timeData[i]);
              showData[showData.length-1]['dateString']=showData[showData.length-1]['dateString'].split('-').reverse().join("-");
            }
            else{
              let tempDate=new Date(nextDate);
              let tempData=showData[showData.length-1];
              tempDate.setDate(tempDate.getDate() + dateStep);
              while(tempDate.getTime()<date.getTime()) {
                  showData.push({"date":nextDate,"dateString":nextDate.toISOString().slice(0,10),"total":tempData['total'],"count":tempData['count'],"firstQuartile":tempData['firstQuartile'],"thirdQuartile":tempData['thirdQuartile'],"list":tempData['list']});
                  nextDate=new Date(tempDate);
                  tempDate.setDate(tempDate.getDate() + dateStep);
              }
              showData.push({"date":new Date(nextDate),"count":1,"list":timeData[i]['list'],"total":timeData[i]['total'],"dateString":nextDate.toISOString().slice(0,10)})
            }
            nextDate.setDate(nextDate.getDate()+dateStep);
          }
        }
        let quartiles=this.getQuartile(showData[showData.length-1]['list']);
        showData[showData.length-1]['firstQuartile'] = quartiles['fQ'];
        showData[showData.length-1]['thirdQuartile'] = quartiles['tQ'];
        showData[showData.length-1]['median'] = quartiles['median'];
        showData.forEach(item =>{
          let sum=0;
          item["list"].forEach( val =>{
            sum+=val;
          })
          item['total']=Math.round(sum/item['list'].length);
        })
        var chart = AmCharts.makeChart("chartdiv", {
          "type": "serial",
          "theme": "light",
          "marginRight": 40,
          "marginLeft": 40,
          "autoMarginOffset": 20,
          "mouseWheelZoomEnabled":true,
          "dataDateFormat": "YYYY-MM-DD",
          "synchronizeGrid":true,
          "legend": {
            "useGraphSettings": true,
            "valueWidth":100,
          },
          "valueAxes": [{
                "id":"v1",
                "axisColor": "#FF6600",
                "axisThickness": 2,
                "axisAlpha": 1,
                "position": "left"
            }, {
                "id":"v2",
                "axisColor": "#FCD202",
                "axisThickness": 2,
                "axisAlpha": 1,
                "position": "right"
            }],
          "balloon": {
              "borderThickness": 1,
              "shadowAlpha": 0
          },
          "graphs": [{
                "valueAxis": "v1",
                "lineColor": "#801F15",
                "bullet": "square",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 30,
                "title": "Average price",
                "balloonText":"Mean:[[value]]",
                "valueField": "total",
            "fillAlphas": 0
            },{
                "valueAxis": "v1",
                "lineColor": "#FF6600",
                "bullet": "round",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 30,
                "title": "First quartile",
                "balloonText":"First Quartile: [[value]]",
                "valueField": "firstQuartile",
            "fillAlphas": 0
            },{
                "valueAxis": "v1",
                "lineColor": "#FF6600",
                "bullet": "round",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 30,
                "title": "Third Quartile",
                "balloonText":"Third Quartile: [[value]]",
                "valueField": "thirdQuartile",
            "fillAlphas": 0
            },{
                "valueAxis": "v1",
                "lineColor": "#A5C663",
                "bullet": "triangleUp",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 30,
                "title": "Median",
                "balloonText":"Median: [[value]]",
                "valueField": "median",
            "fillAlphas": 0
            }, {
                "valueAxis": "v2",
                "lineColor": "#FCD202",
                "bullet": "square",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 30,
                "title": "Post's count",
                "valueField": "count",
            "fillAlphas": 0
            }],
          // "chartScrollbar": {
          //     "graph": "g1",
          //     "oppositeAxis":false,
          //     "offset":30,
          //     "scrollbarHeight": 80,
          //     "backgroundAlpha": 0,
          //     "selectedBackgroundAlpha": 0.1,
          //     "selectedBackgroundColor": "#888888",
          //     "graphFillAlpha": 0,
          //     "graphLineAlpha": 0.5,
          //     "selectedGraphFillAlpha": 0,
          //     "selectedGraphLineAlpha": 1,
          //     "autoGridCount":true,
          //     "color":"#AAAAAA"
          // },
          "chartCursor": {
              "pan": true,
              "valueLineEnabled": true,
              "valueLineBalloonEnabled": true,
              "cursorAlpha":1,
              "cursorColor":"#258cbb",
              "limitToGraph":"g1",
              "valueLineAlpha":0.2,
              "valueZoomable":true
          },
          "valueScrollbar":{
            "oppositeAxis":false,
            "offset":50,
            "scrollbarHeight":10
          },
          "categoryField": "dateString",
          "categoryAxis": {
              "parseDates": true,
              "dashLength": 1,
              "minorGridEnabled": true
          },
          "export": {
              "enabled": true
          },
          "dataProvider":showData
        });

        chart.addListener("rendered", function(){
          chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
        });
      });
  }

  getQuartile(array){
    array.sort(function(a,b){return a-b;});
    let median =0;
    let firstQuartile = 0 ;
    let thirdQuartile = 0;
    if(array.length%2==0){
          median=(array[array.length/2-1]+array[array.length/2])/2
      }
      else{
          median = array[Math.floor(array.length/2)];
      }
      let halfLength=Math.floor(array.length/2);
      if(halfLength%2 == 0){
          firstQuartile = (array[halfLength/2-1]+array[halfLength/2])/2;
          thirdQuartile = (array[Math.floor(halfLength*3/2)-1]+array[Math.floor(halfLength*3/2)])/2;

      }
      else{
          firstQuartile = array[Math.floor(halfLength/2)];
          thirdQuartile = array[Math.floor(halfLength/2)+halfLength];
      }
    return {"median":median,"fQ":firstQuartile,"tQ":thirdQuartile};
  }

  drawScatterPrice(){
    this.houseService.getHouse(this.menuComponent.getSelected(),this.menuComponent.province, this.menuComponent.county, 
      this.menuComponent.ward, this.menuComponent.transType,this.menuComponent.startDate,this.menuComponent.endDate, 0).subscribe( res => {
        if(res['err']==true){
          return;
        }
        else{
          // for(var i =0 ;i<res['data'].length;i++){
          //   res['data'][i]['price']*=res['data'][i]['area'];
          // }
          var chart = AmCharts.makeChart("chartdiv", {
              "type": "xy",
              "theme": "light",
              "autoMarginOffset": 20,
              "dataProvider": res['data'],
              "valueAxes": [{
                  "position": "bottom",
                  "axisAlpha": 0,
                  "dashLength": 1,
                  "title": "X Axis"
              }, {
                  "axisAlpha": 0,
                  "dashLength": 1,
                  "position": "left",
                  "title": "Y Axis"
              }],
              "startDuration": 1,
              "graphs": [{
                  "balloonText": "x:[[x]] y:[[y]]",
                  "bullet": "triangleUp",
                  "lineAlpha": 0,
                  "xField": "area",
                  "yField": "price",
                  "lineColor": "#FF6600",
                  "fillAlphas": 0
              }],
              "trendLines": [{
                  "finalValue": 11,
                  "finalXValue": 12,
                  "initialValue": 2,
                  "initialXValue": 1,
                  "lineColor": "#FF6600"
              }],
              "marginLeft": 64,
              "marginBottom": 60,
              "chartScrollbar": {},
              "chartCursor": {},
              "export": {
                  "enabled": true,
                  "position": "bottom-right"
              }
          });
        }
      });
  }

}
