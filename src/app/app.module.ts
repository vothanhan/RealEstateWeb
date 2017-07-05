import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ToOtherPipe } from './home/toOther.pipe';
import { DropdownMenuComponent } from './dropdown-menu/dropdown-menu.component';
import { RemoveChartDirective } from './home/remove-chart.directive';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';


const appRoutes: Routes = [
    {
      path:'home', 
      component: HomeComponent},
    {
      path:'', 
      redirectTo: '/home',
      pathMatch:'full'
    },
    {path:'**', component: PageNotFoundComponent}
]


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    ToOtherPipe,
    DropdownMenuComponent,
    RemoveChartDirective
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(appRoutes),
    MultiselectDropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
