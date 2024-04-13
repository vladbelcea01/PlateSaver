import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

export interface Restaurant {
  name: string;
  description?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  operatingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}


@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrl: './add-restaurant.component.css'
})
export class AddRestaurantComponent implements OnInit{

  restaurantForm!: FormGroup;

  constructor(private dialogRef: MatDialogRef<AddRestaurantComponent>,
  ){}

  ngOnInit(): void {
    this.restaurantForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      address: new FormGroup({
        street: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        postalCode: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required)
      }),
      contact: new FormGroup({
        phone: new FormControl(''),
        email: new FormControl('', Validators.email),
        website: new FormControl('')
      }),
      operatingHours: new FormGroup({
        monday: new FormControl('', Validators.required),
        tuesday: new FormControl(''),
        wednesday: new FormControl(''),
        thursday: new FormControl(''),
        friday: new FormControl(''),
        saturday: new FormControl(''),
        sunday: new FormControl('')
      }),
      socialMedia: new FormGroup({
        facebook: new FormControl(''),
        twitter: new FormControl(''),
        instagram: new FormControl('')
      })
    });
  }
  
  
    save(): void {
      // Logic to save the restaurant data
      this.dialogRef.close(this.restaurantForm.value);
    }
  
    close(): void {
      this.dialogRef.close();
    }

}
