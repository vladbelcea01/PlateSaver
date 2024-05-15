import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Auth } from 'aws-amplify';
import { CartService } from './components/common/cart.service';
import { MyBackendService } from '../../backend/src/my-backend.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentGuard implements CanActivate {
  cart: any;
  order: any;
  orderId!: string;
  restaurant: any;

  constructor(
    private router: Router,
    private cartService: CartService,
    public myBackendService: MyBackendService
  ) {
    this.cart = cartService.getCart();
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    this.orderId = route.params['orderId'];

    if (!this.orderId) {
      console.error('Order ID is not available');
      this.router.navigate(['/home']);
      return false;
    }

    try {
      await this.getOrderbyId();
    } catch (error) {
      console.error('Error fetching order:', error);
      this.router.navigate(['/home']);
      return false;
    }

    if (this.order.payed === 'Paid') {
      window.alert('Order already paid!');
      console.error('Order already paid');
      this.router.navigate(['/home']);
      return false;
    }

    if (this.order.reserved === 'Reserved' && this.restaurant.paymentMethod === 'Cash Only') {
      window.alert('Order already reserved at restaurant with cash only payment method!');
      console.error('Order already reserved at restaurant with cash only payment method');
      this.router.navigate(['/home']);
      return false;
    }  

    if (this.cart.items.length === 0) {
      window.alert("Basket is empty!");
      console.error('Basket is empty');
      this.router.navigate(['/home']);
      return false;
    }

    try {
      await Auth.currentAuthenticatedUser();
      return true;
    } catch (error) {
      window.alert("User not authenticated!");
      console.error('User not authenticated', error);
      this.router.navigate(['/home']);
      return false;
    }
  }

  async getRestaurantbyName(restaurantName: string): Promise<void> {
    try {
      this.restaurant = await this.myBackendService.getRestaurantbyRestaurantName(restaurantName).toPromise();
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      throw error;
    }
  }

  async getOrderbyId(): Promise<void> {
    try {
      this.order = await this.myBackendService.getOrderbyId(this.orderId).toPromise();
      await this.getRestaurantbyName(this.order.products[0].food.restaurant);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
}
