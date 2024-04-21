import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MyBackendService } from '../../../../../../backend/src/my-backend.service';
import { HttpClient } from '@angular/common/http';

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
  photo?: File;
}


@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrl: './add-restaurant.component.css'
})
export class AddRestaurantComponent implements OnInit{

  restaurantForm!: FormGroup;

  constructor(private dialogRef: MatDialogRef<AddRestaurantComponent>,
    public myBackendService: MyBackendService,
    private http: HttpClient
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
      }),
      photo: new FormControl(null)
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.restaurantForm.patchValue({ photo: file });
    }
  }
  
    save(): void {
      if (this.restaurantForm.valid) {
        const restaurantData = this.restaurantForm.value;
        const formData: FormData = new FormData();
        formData.append('name', restaurantData.name);
        formData.append('description', restaurantData.description);
        formData.append('photo', restaurantData.photo);
    
        formData.append('address.street', restaurantData.address.street);
        formData.append('address.city', restaurantData.address.city);
        formData.append('address.state', restaurantData.address.state);
        formData.append('address.postalCode', restaurantData.address.postalCode);
        formData.append('address.country', restaurantData.address.country);
    
        formData.append('contact.phone', restaurantData.contact.phone);
        formData.append('contact.email', restaurantData.contact.email);
        formData.append('contact.website', restaurantData.contact.website);
    
        formData.append('operatingHours.monday', restaurantData.operatingHours.monday);
        formData.append('operatingHours.tuesday', restaurantData.operatingHours.tuesday);
        formData.append('operatingHours.wednesday', restaurantData.operatingHours.wednesday);
        formData.append('operatingHours.thursday', restaurantData.operatingHours.thursday);
        formData.append('operatingHours.friday', restaurantData.operatingHours.friday);
        formData.append('operatingHours.saturday', restaurantData.operatingHours.saturday);
        formData.append('operatingHours.sunday', restaurantData.operatingHours.sunday);

        formData.append('socialMedia.facebook', restaurantData.socialMedia.facebook);
        formData.append('socialMedia.twitter', restaurantData.socialMedia.twitter);
        formData.append('socialMedia.instagram', restaurantData.socialMedia.instagram);
        this.myBackendService.saveRestaurant(formData).subscribe(
          response => {
            console.log('Restaurant saved successfully:', response);
            this.dialogRef.close(restaurantData);
          },
          error => {
            console.error('Error saving restaurant:', error);
          }
        );
      this.dialogRef.close(this.restaurantForm.value);
    }
  }
  
    close(): void {
      this.dialogRef.close();
    }

}
