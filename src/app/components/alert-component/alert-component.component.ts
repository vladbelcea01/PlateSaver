import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertDialogModel } from '../../models/alert-dialog';

@Component({
  selector: 'app-alert-component',
  templateUrl: './alert-component.component.html',
  styleUrl: './alert-component.component.css'
})
export class AlertDialogComponent implements OnInit {
  hasConfirm: boolean = true;
  hasCancel: boolean = true;
  message;
  constructor(public dialogRef: MatDialogRef<AlertDialogComponent>,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: AlertDialogModel) { 
      this.hasConfirm = data.hasConfirm !== undefined ? data.hasConfirm : true;
      this.hasCancel = data.hasCancel !== undefined ? data.hasCancel : true;
      this.message = this.sanitizer.bypassSecurityTrustHtml(this.data?.message);
  }

  ngOnInit(): void {
  }

  onConfirm(): void {
    this.dialogRef.close({confirm: true});
  }

  onCancel(): void {
    this.dialogRef.close({cancel: true});
  }

}