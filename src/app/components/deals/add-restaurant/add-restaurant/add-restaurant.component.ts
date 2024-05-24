import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MyBackendService } from '../../../../../../backend/src/my-backend.service';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../common/utils.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertDialogComponent } from '../../../alert-component/alert-component.component';

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
  owner: string;
  paymentMethod: string;
}

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrl: './add-restaurant.component.css'
})
export class AddRestaurantComponent implements OnInit{

  restaurantForm!: FormGroup;
  role: any;
  email: any;

  constructor(private dialogRef: MatDialogRef<AddRestaurantComponent>,
    public myBackendService: MyBackendService,
    private http: HttpClient,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ){
    this.role = localStorage.getItem('role');
    this.email = localStorage.getItem('email');
  }

  ngOnInit(): void {
    this.restaurantForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      address: new FormGroup({
        street: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        postalCode: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required)
      }),
      contact: new FormGroup({
        phone: new FormControl('', Validators.required),
        email: new FormControl('', Validators.email),
        website: new FormControl('')
      }),
      operatingHours: new FormGroup({
        monday: new FormControl('', Validators.required),
        tuesday: new FormControl('', Validators.required),
        wednesday: new FormControl('', Validators.required),
        thursday: new FormControl('', Validators.required),
        friday: new FormControl('', Validators.required),
        saturday: new FormControl('', Validators.required),
        sunday: new FormControl('', Validators.required)
      }),
      socialMedia: new FormGroup({
        facebook: new FormControl(''),
        twitter: new FormControl(''),
        instagram: new FormControl('')
      }),
      owner: new FormControl({value: '', disabled: true}, Validators.required),
      photo: new FormControl(null),
      paymentMethod: new FormControl('', Validators.required)
    });
    if(this.role == 'superadmin'){
      this.restaurantForm.get('owner')?.enable();
    }

    if(this.role == 'admin'){
      this.restaurantForm.get('owner')?.setValue(this.email);
    }
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
      if (restaurantData.photo) {
        formData.append('photo', restaurantData.photo);
      }
      if(this.role == 'admin')
        {
        formData.append('owner', this.email)
        }
      else{
        formData.append('owner', restaurantData.owner);
      }
      formData.append('paymentMethod', restaurantData.paymentMethod);
  
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
  
      this.myBackendService.getRestaurants().subscribe(
        (response: any[]) => {
          const existingRestaurant = response.find(restaurant => restaurant.name.toLowerCase() === restaurantData.name.toLowerCase());
  
          if (existingRestaurant) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'Restaurant Name Conflict',
                hasCancel: false,
                message:
                  `Restaurant Name already exists. Please choose another name.`,
              },
            });
          } else {
            this.myBackendService.saveRestaurant(formData).subscribe(
              response => {
                console.log('Restaurant saved successfully:', response);
                UtilsService.openSnackBar("Restaurant saved successfully", this.snackBar, UtilsService.SnackbarStates.Success);
                this.dialogRef.close(restaurantData);
              },
              error => {
                UtilsService.openSnackBar("Error saving restaurant", this.snackBar, UtilsService.SnackbarStates.Error);
                console.error('Error saving restaurant:', error);
              }
            );
          }
        },
        error => {
          console.error('Error fetching restaurants:', error);
          UtilsService.openSnackBar("Error fetching existing restaurants", this.snackBar, UtilsService.SnackbarStates.Error);
        }
      );
    }
  }
  
    close(): void {
      this.dialogRef.close();
    }

}
