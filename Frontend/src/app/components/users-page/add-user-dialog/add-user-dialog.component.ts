import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent {
  addUserForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
  ) {
    this.addUserForm = new FormGroup({
      email: new FormControl('', (Validators.required, Validators.email)),
      password: new FormControl('', (Validators.required, Validators.minLength(6), this.passwordValidator)),
      given_name: new FormControl('', Validators.required),
      family_name: new FormControl('', Validators.required),
      phone_number: new FormControl('', (Validators.required, this.phoneNumberValidator())),
      custom_role: new FormControl('user', Validators.required)
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.addUserForm.valid) {
      this.dialogRef.close(this.addUserForm.value);
    }
  }

  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

    return !passwordValid ? { passwordComplexity: true } : null;
  }

  phoneNumberValidator(): Validators {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const valid = /^\+\d+/.test(value);  // Ensures the phone number starts with a '+'
      if (!valid) {
        return { invalidPhoneNumber: true };
      }
      return null;
    };
  }
}
