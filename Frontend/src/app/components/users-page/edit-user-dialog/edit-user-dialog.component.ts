import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserElement } from '../users-page.component';

export interface DialogData {
  user: UserElement;
}

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
export class EditUserDialogComponent {
  editUserForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.editUserForm = new FormGroup({
      email: new FormControl(data.user.email, (Validators.required, Validators.email)),
      given_name: new FormControl(data.user.given_name, Validators.required),
      family_name: new FormControl(data.user.family_name, Validators.required),
      phone_number: new FormControl(data.user.phone_number, Validators.required),
      custom_role: new FormControl(data.user.custom_role, Validators.required),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.editUserForm.valid) {
      this.dialogRef.close(this.editUserForm.value);
    }
  }
}
