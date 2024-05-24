import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Restaurant } from '../add-restaurant/add-restaurant/add-restaurant.component';
import { MyBackendService } from '../../../../../backend/src/my-backend.service';
import { CognitoService } from '../../../services/cognito.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from '../../common/utils.service';
import { AlertDialogComponent } from '../../alert-component/alert-component.component';

interface FormInput<T = string> {
  value: T;
  viewValue: string;
}

@Component({
  selector: 'app-edit-restaurant',
  templateUrl: './edit-restaurant.component.html',
  styleUrl: './edit-restaurant.component.css'
})


export class EditRestaurantComponent {

  restaurantForm!: FormGroup;
  restaurantId!: string;
  role: any;

  constructor(
    private dialogRef: MatDialogRef<EditRestaurantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private myBackendService: MyBackendService,
    private cognitoService: CognitoService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { 
    this.role = localStorage.getItem('role');
  }

  ngOnInit(): void {
    this.restaurantForm = new FormGroup({
      name: new FormControl(this.data.name, Validators.required),
      description: new FormControl(this.data.description, Validators.required),
      address: new FormGroup({
        street: new FormControl(this.data.address.street, Validators.required),
        city: new FormControl(this.data.address.city, Validators.required),
        state: new FormControl(this.data.address.state, Validators.required),
        postalCode: new FormControl(this.data.address.postalCode, Validators.required),
        country: new FormControl(this.data.address.country, Validators.required)
      }),
      contact: new FormGroup({
        phone: new FormControl(this.data.contact?.phone, Validators.required),
        email: new FormControl(this.data.contact?.email, Validators.email),
        website: new FormControl(this.data.contact?.website)
      }),
      operatingHours: new FormGroup({
        monday: new FormControl(this.data.operatingHours?.monday, Validators.required),
        tuesday: new FormControl(this.data.operatingHours?.tuesday, Validators.required),
        wednesday: new FormControl(this.data.operatingHours?.wednesday, Validators.required),
        thursday: new FormControl(this.data.operatingHours?.thursday, Validators.required),
        friday: new FormControl(this.data.operatingHours?.friday, Validators.required),
        saturday: new FormControl(this.data.operatingHours?.saturday, Validators.required),
        sunday: new FormControl(this.data.operatingHours?.sunday, Validators.required)
      }),
      socialMedia: new FormGroup({
        facebook: new FormControl(this.data.socialMedia?.facebook),
        twitter: new FormControl(this.data.socialMedia?.twitter),
        instagram: new FormControl(this.data.socialMedia?.instagram)
      }),
      owner: new FormControl(this.data.owner, Validators.required),
      photo: new FormControl(null),
      paymentMethod: new FormControl(this.data.paymentMethod, Validators.required)
      
    });
    this.restaurantId = this.data._id;
    if(this.role == 'admin'){
      this.restaurantForm.get('owner')?.disable();
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
      if (restaurantData.photo != null) {
        formData.append('photo', restaurantData.photo);
      }
      formData.append('owner', restaurantData.owner);
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
      const restaurantId = this.restaurantId;

      this.myBackendService.getRestaurants().subscribe(
        (response: any[]) => {
          const existingRestaurant = response.find(restaurant => restaurant.name.toLowerCase() === restaurantData.name.toLowerCase());
  
          if (existingRestaurant && this.data.name != restaurantData.name) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: {
                title: 'Restaurant Name Conflict',
                hasCancel: false,
                message:
                  `Restaurant Name already exists. Please choose another name.`,
              },
            });
          } else {
            this.myBackendService.updateRestaurant(restaurantId,formData).subscribe(
              response => {
                console.log('Restaurant updated successfully:', response);
                UtilsService.openSnackBar("Restaurant updated successfully", this.snackBar, UtilsService.SnackbarStates.Success);
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
          console.error('Error updating restaurant:', error);
          UtilsService.openSnackBar("Error updating restaurant", this.snackBar, UtilsService.SnackbarStates.Error);
        }
      );
    }
  }

  close(): void {
    this.dialogRef.close();
  }


}
