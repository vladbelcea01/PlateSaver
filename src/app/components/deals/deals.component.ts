import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant/add-restaurant.component';

export interface DialogData {

}


@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrl: './deals.component.css'
})
export class DealsComponent implements OnInit{

  constructor( private router: Router,
    private cognitoService: CognitoService,
    public dialog: MatDialog,
  ){}

  ngOnInit(): void {
      
  }

  addRestaurant(){
    const dialogRef = this.dialog.open(AddRestaurantComponent, {
      width: '600px',
      height: 'auto',

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
