import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-restaurant-info',
  templateUrl: './restaurant-info.component.html',
  styleUrl: './restaurant-info.component.css',
})
export class RestaurantInfoComponent implements OnInit {
  restaurant: any;

  constructor(
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<RestaurantInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.restaurant = this.data;
  }

  ngOnInit(): void {}

  getMapUrl(address: any): SafeResourceUrl {
    const addressQuery = `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
    const encodedAddress = encodeURIComponent(addressQuery);
    const url = `https://www.google.com/maps/embed/v1/place?key=AIzaSyC_9EO69bYyXlx9s81-yWltHw1QxDEyczs&q=${encodedAddress}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  close(): void {
    this.dialogRef.close();
  }
}
