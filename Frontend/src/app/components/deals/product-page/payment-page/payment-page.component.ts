import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../common/cart.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from '../../../common/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MyBackendService } from '../../../common/my-backend.service';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.css'
})
export class PaymentPageComponent implements OnInit {
  restaurant: any;
  cart: any;
  order: any;
  selectedPaymentMethod: string = '';
  reservation: boolean = false;
  mapUrl!: SafeResourceUrl;
  orderId!: string;

  constructor(private cartService: CartService,
    public myBackendService: MyBackendService,
    private sanitizer: DomSanitizer,
    public snackBar: MatSnackBar,
    private router:Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (params) => {
      this.orderId = params['orderId'];
      await this.getOrderbyId(this.orderId);
    });
  }

  async getRestaurantbyName(restaurantName: string): Promise<void> {
    await this.myBackendService
      .getRestaurantbyRestaurantName(restaurantName)
      .subscribe(
        (result) => {
          this.restaurant = result;
          this.updateMapUrl();
        },
        (error) => {
          console.error('Error fetching restaurants:', error);
        }
      );
  }

  async getOrderbyId(id: string): Promise<void> {
    await this.myBackendService
      .getOrderbyId(id)
      .subscribe(
        (result) => {
          this.order = result;
          this.getRestaurantbyName(this.order.products[0].food.restaurant)
        },
        (error) => {
          console.error('Error fetching orders:', error);
        }
      );
  }

  updateMapUrl(): void {
    const addressQuery = `${this.restaurant.address.street}, ${this.restaurant.address.city}, ${this.restaurant.address.state}, ${this.restaurant.address.postalCode}, ${this.restaurant.address.country}`;
    const encodedAddress = encodeURIComponent(addressQuery);
    const url = `https://www.google.com/maps/embed/v1/place?key=AIzaSyC_9EO69bYyXlx9s81-yWltHw1QxDEyczs&q=${encodedAddress}`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  checkPaymentMethod() {
    if (this.restaurant.paymentMethod === 'Card Only') {
      this.selectedPaymentMethod = 'card';
    }

  }

  confirmReservation() {
    this.reservation = true;
    this.myBackendService.pay(this.order._id, this.order, this.reservation).subscribe(
      {
        next: (orderId) => {
          this.cartService.clearCart();
          this.router.navigateByUrl('/track/' + this.order._id);
          UtilsService.openSnackBar('Reservation saved successfully', this.snackBar, UtilsService.SnackbarStates.Success);
        },
        error: (error) => {
          UtilsService.openSnackBar('Reservation Save Failed', this.snackBar, UtilsService.SnackbarStates.Error);
        }
      }
    );
  }

}
