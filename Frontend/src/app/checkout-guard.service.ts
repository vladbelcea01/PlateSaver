import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { CartService } from './components/common/cart.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutGuard implements CanActivate {
  cart: any;

  constructor(private router: Router, private cartService: CartService) {
    this.cart = cartService.getCart();
  }

  async canActivate(): Promise<boolean> {
    if (this.cart.items.length === 0) {
      if (typeof window !== "undefined"){
        window.alert("Basket is empty!");
      }
      console.error('Basket is empty');
      this.router.navigate(['/home']);
      return false;
    }


    try {
      await Auth.currentAuthenticatedUser();
      return true;
    } catch (error) {
      if (typeof window !== "undefined") {
      window.alert("User not authenticated!");
      }
      console.error('User not authenticated', error);
      this.router.navigate(['/home']);
      return false;
    }
  }
}
