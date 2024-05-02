import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MyBackendService } from '../../../../../../../backend/src/my-backend.service';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';

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
      photo: new FormControl(null)
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
      this.myBackendService.saveDish(formData).subscribe(
        (response) => {
          console.log('Dish saved successfully:', response);
          this.dialogRef.close(dishData);
        },
        (error) => {
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
