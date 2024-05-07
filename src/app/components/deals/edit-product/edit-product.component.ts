import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MyBackendService } from '../../../../../backend/src/my-backend.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from '../../common/utils.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  dishForm!: FormGroup;
  productId!: string;

  constructor(
    private dialogRef: MatDialogRef<EditProductComponent>,
    public myBackendService: MyBackendService,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.dishForm = new FormGroup({
      dishName: new FormControl(this.data.dishName, Validators.required),
      description: new FormControl(this.data.description, Validators.required),
      category: new FormControl(this.data.category, Validators.required),
      price: new FormControl(this.data.price, Validators.required),
      newPrice: new FormControl(this.data.newPrice),
      quantity: new FormControl(this.data.quantity),
      ingredients: new FormControl(this.data.ingredients, Validators.required),
      photo: new FormControl(null),
      dietaryInfo: new FormControl(this.data.dietaryInfo, Validators.required),
      allergens: new FormControl(this.data.allergens, Validators.required),
      pickupStartTime: new FormControl(this.data.pickupStartTime, Validators.required),
      pickupEndTime: new FormControl(this.data.pickupEndTime, Validators.required)
    });
    this.productId = this.data._id;
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
      formData.append('dietaryInfo', dishData.dietaryInfo);
      formData.append('allergens', dishData.allergens);
      formData.append('pickupStartTime', dishData.pickupStartTime);
      formData.append('pickupEndTime', dishData.pickupEndTime);
      if(dishData.photo != null){
        formData.append('photo', dishData.photo);
      }
      const productId = this.productId;
       this.myBackendService.updateProduct(productId, formData).subscribe(
         (response) => {
          UtilsService.openSnackBar("Dish updated successfully", this.snackBar, UtilsService.SnackbarStates.Success);
           console.log('Dish updated successfully:', response);
           this.dialogRef.close(dishData);
         },
         (error) => {
          UtilsService.openSnackBar("Error updating dish", this.snackBar, UtilsService.SnackbarStates.Error);
           console.error('Error updating dish:', error);
         }
       );
      this.dialogRef.close(this.dishForm.value);
    }
  }

  close() {
    this.dialogRef.close();
  }

}
