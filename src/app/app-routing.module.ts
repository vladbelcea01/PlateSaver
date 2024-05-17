import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DealsComponent } from './components/deals/deals.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AuthGuard } from './auth-guard.service';
import { RestaurantPageComponent } from './components/deals/restaurant-page/restaurant-page/restaurant-page.component';
import { ProductPageComponent } from './components/deals/product-page/product-page.component';
import { CartPageComponent } from './components/deals/product-page/cart-page/cart-page.component';
import { CheckoutPageComponent } from './components/deals/product-page/checkout-page/checkout-page.component';
import { PaymentPageComponent } from './components/deals/product-page/payment-page/payment-page.component';
import { CheckoutGuard } from './checkout-guard.service';
import { PaymentGuard } from './payment-guard.service';
import { TrackingPageComponent } from './components/deals/product-page/tracking-page/tracking-page.component';
import { OrdersPageComponent } from './components/orders-page/orders-page.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'deals', component: DealsComponent, canActivate: [AuthGuard] },
  { path: 'deals/:name', component: RestaurantPageComponent, canActivate: [AuthGuard]},
  { path: 'deals/:name/:product', component: ProductPageComponent, canActivate: [AuthGuard]},
  {path: 'cart', component: CartPageComponent, canActivate: [AuthGuard]},
  {path: 'checkout', component: CheckoutPageComponent, canActivate: [CheckoutGuard]},
  {path: 'payment/:orderId', component: PaymentPageComponent, canActivate: [PaymentGuard]},
  {path:'track/:orderId', component: TrackingPageComponent, canActivate:[AuthGuard]},
  {path:'orders', component: OrdersPageComponent, canActivate:[AuthGuard]},
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'deals', component: DealsComponent },
      {path: 'deals/:name', component: RestaurantPageComponent},
      {path: 'deals/:name/:product', component: ProductPageComponent},
      {path: 'cart', component: CartPageComponent},
      {path: 'checkout', component: CheckoutPageComponent},
      {path: 'payment/:orderId', component: PaymentPageComponent},
      {path:'track/:orderId', component: TrackingPageComponent},
      {path: 'orders', component: OrdersPageComponent},
    ],
  },
  { path: '**', component: SignInComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
