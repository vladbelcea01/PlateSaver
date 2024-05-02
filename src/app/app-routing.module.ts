import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DealsComponent } from './components/deals/deals.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AuthGuard } from './auth-guard.service';
import { RestaurantPageComponent } from './components/deals/restaurant-page/restaurant-page/restaurant-page.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'deals', component: DealsComponent, canActivate: [AuthGuard] },
  { path: 'deals/:name', component: RestaurantPageComponent, canActivate: [AuthGuard]},
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'deals', component: DealsComponent },
      {path: 'deals/:name', component: RestaurantPageComponent}
    ],
  },
  { path: '**', component: SignInComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
