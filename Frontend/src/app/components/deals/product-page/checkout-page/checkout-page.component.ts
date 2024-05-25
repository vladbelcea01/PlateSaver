import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../../common/cart.service';
import { CognitoService } from '../../../../services/cognito.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from '../../../common/utils.service';
import { MyBackendService } from '../../../common/my-backend.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css',
})
export class CheckoutPageComponent implements OnInit {
  checkoutForm: any;
  currentUserGivenName: string | null = null;
  currentUserFamilyName: string | null = null;
  currentUserEmail: string | null = null;
  currentPhoneNumber: string | null = null;
  fullName: string = '';
  restaurant: any;
  cart: any;
  mapUrl!: SafeResourceUrl;
  addressQuery!: string;

  constructor(
    cartService: CartService,
    private cognitoService: CognitoService,
    public myBackendService: MyBackendService,
    private sanitizer: DomSanitizer,
    private router: Router,
    public snackBar: MatSnackBar
  ) {
    this.cart = cartService.getCart();
  }

  async ngOnInit(): Promise<void> {
    this.checkoutForm = new FormGroup({
      name: new FormControl(this.fullName, Validators.required),
      phoneNumber: new FormControl('', Validators.required),
    });
    await this.populateFullName();
    await this.getCurrentUserPhoneNumber();
    await this.getCurrentUserEmail();
    this.checkoutForm.get('phoneNumber').setValue(this.currentPhoneNumber);
    await this.getRestaurantbyName(this.cart.items[0].food.restaurant);
  }

  async getCurrentUserGivenName(): Promise<void> {
    this.currentUserGivenName = await this.cognitoService.getGivenName();
  }

  async getCurrentUserFamilyName(): Promise<void> {
    this.currentUserFamilyName = await this.cognitoService.getFamilyName();
  }

  async getCurrentUserEmail(): Promise<void> {
    this.currentUserEmail = await this.cognitoService.getEmail();
  }

  async getCurrentUserPhoneNumber(): Promise<void> {
    this.currentPhoneNumber = await this.cognitoService.getPhoneNumber();
  }

  async populateFullName(): Promise<void> {
    const givenName = await this.cognitoService.getGivenName();
    const familyName = await this.cognitoService.getFamilyName();
    this.fullName = `${givenName} ${familyName}`.trim();
    if (!this.checkoutForm) {
      return;
    }
    this.checkoutForm.get('name').setValue(this.fullName);
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

  updateMapUrl(): void {
    this.addressQuery = `${this.restaurant.address.street}, ${this.restaurant.address.city}, ${this.restaurant.address.state}, ${this.restaurant.address.postalCode}, ${this.restaurant.address.country}`;
    const encodedAddress = encodeURIComponent(this.addressQuery);
    const url = `https://www.google.com/maps/embed/v1/place?key=AIzaSyC_9EO69bYyXlx9s81-yWltHw1QxDEyczs&q=${encodedAddress}`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  createOrder() {
    if (this.checkoutForm.valid) {
      const orderData = this.checkoutForm.value;
      const today = new Date();
      const formattedDate = today.toISOString();
  
      const order = {
        name: orderData.name,
        phone_number: orderData.phoneNumber,
        email: this.currentUserEmail,
        products: this.cart.items,
        totalPayment: this.cart.totalPrice,
        address: this.addressQuery,
        payed: 'Not Paid',
        reserved: 'Not Reserved',
        orderDate: formattedDate
      };
  
      this.myBackendService.saveOrder(order).subscribe(
        (response) => {
          UtilsService.openSnackBar('Order saved successfully', this.snackBar, UtilsService.SnackbarStates.Success);
          console.log('Order saved successfully:', response);
          this.router.navigateByUrl('/payment/' + response._id);
        },
        (error) => {
          UtilsService.openSnackBar('Error saving order', this.snackBar, UtilsService.SnackbarStates.Error);
          console.error('Error saving order:', error);
        }
      );
    }
  }
  
}
