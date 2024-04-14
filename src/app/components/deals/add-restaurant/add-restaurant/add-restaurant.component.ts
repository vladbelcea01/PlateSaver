import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MyBackendService } from '../../../../../../backend/src/my-backend.service';

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
    public myBackendService: MyBackendService
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
      if (this.restaurantForm.valid) { // Check if the form is valid before saving
        const restaurantData = this.restaurantForm.value;
        this.myBackendService.saveRestaurant(restaurantData).subscribe(
          response => {
            console.log('Restaurant saved successfully:', response);
            // Optionally, you can handle the response here (e.g., show a success message)
            this.dialogRef.close(restaurantData); // Close the dialog after saving
          },
          error => {
            console.error('Error saving restaurant:', error);
            // Optionally, you can handle the error here (e.g., show an error message)
          }
        );
      this.dialogRef.close(this.restaurantForm.value);
    }
  }
  
    close(): void {
      this.dialogRef.close();
    }

}
