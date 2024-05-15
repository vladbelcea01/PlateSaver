import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../common/cart.service';
import { MyBackendService } from '../../../../../../backend/src/my-backend.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tracking-page',
  templateUrl: './tracking-page.component.html',
  styleUrl: './tracking-page.component.css'
})
export class TrackingPageComponent implements OnInit{

  order: any;
  orderId!: string;
  mapUrl!: SafeResourceUrl;
  restaurant!: any;
  addressQuery!: string;

  constructor(public myBackendService: MyBackendService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router:Router) { }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (params) => {
      this.orderId = params['orderId'];
      await this.getOrderbyId(this.orderId);
    });
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

  acknowledgeMessage(): void {
    this.sendOrderEmail();
    this.router.navigateByUrl('/home');
  }

  sendOrderEmail(): void {
    this.myBackendService
      .sendOrderEmail(this.order).subscribe(
      (response) => {
        console.log('Email sent successfully');
      },
      (error) => {
        console.error('Error sending email:', error);
      }
    );
  }

}
