import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MyBackendService } from '../../../../../../../backend/src/my-backend.service';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from '../../../../common/utils.service';

export interface Dish {
  dishName: string;
  description?: string;
  category: string;
  price: number;
  newPrice?: number;
  quantity?: number;
  ingredients: string;
  photo?: File;
  restaurant: string
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit {
  dishForm!: FormGroup;
  restaurant!: string;

  constructor(
    private dialogRef: MatDialogRef<AddProductComponent>,
    public myBackendService: MyBackendService,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
    this.restaurant = data;
  }

  ngOnInit(): void {
    this.dishForm = new FormGroup({
      dishName: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      newPrice: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      ingredients: new FormControl('', Validators.required),
      photo: new FormControl(null),
      dietaryInfo: new FormControl('', Validators.required),
      allergens: new FormControl('', Validators.required),
      pickupStartTime: new FormControl('', Validators.required),
      pickupEndTime: new FormControl('', Validators.required)
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.dishForm.patchValue({ photo: file });
    }
  }

  submitForm() {
    if (this.dishForm.valid) {
      const dishData = this.dishForm.value;
      const formData: FormData = new FormData();
      formData.append('dishName', dishData.dishName);
      formData.append('description', dishData.description);
      formData.append('category', dishData.category);
      formData.append('price', dishData.price);
      formData.append('newPrice', dishData.newPrice);
      formData.append('ingredients', dishData.ingredients);
      formData.append('quantity', dishData.quantity);
      formData.append('photo', dishData.photo);
      formData.append('restaurant', this.restaurant);
      formData.append('dietaryInfo', dishData.dietaryInfo);
      formData.append('allergens', dishData.allergens);
      formData.append('pickupStartTime', dishData.pickupStartTime);
      formData.append('pickupEndTime', dishData.pickupEndTime);
      this.myBackendService.saveDish(formData).subscribe(
        (response) => {
          UtilsService.openSnackBar("Dish saved successfully", this.snackBar, UtilsService.SnackbarStates.Success)
          console.log('Dish saved successfully:', response);
          this.dialogRef.close(dishData);
        },
        (error) => {
          UtilsService.openSnackBar("Error saving dish", this.snackBar, UtilsService.SnackbarStates.Error)
          console.error('Error saving dish:', error);
        }
      );
      this.dialogRef.close(this.dishForm.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
