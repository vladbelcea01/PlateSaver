import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant/add-restaurant.component';
import { MyBackendService } from '../../../../backend/src/my-backend.service';
import { resourceLimits } from 'worker_threads';

export interface DialogData {

}


@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrl: './deals.component.css'
})
export class DealsComponent implements OnInit{
  restaurants: any;
  currentUserRole: string | null = null;

  constructor( private router: Router,
    private cognitoService: CognitoService,
    public dialog: MatDialog,
    public myBackendService: MyBackendService,
  ){}

  ngOnInit(): void {
    this.updateCurrentUserRole();
    this.getRestaurants();
  }

  async updateCurrentUserRole(): Promise<void> {
    this.currentUserRole = await this.cognitoService.getRole();
    console.log(this.currentUserRole);
  }

  addRestaurant(){
    const dialogRef = this.dialog.open(AddRestaurantComponent, {
      width: '600px',
      height: 'auto',

    });

    dialogRef.afterClosed().subscribe(result => {
      this.getRestaurants();
      console.log('The dialog was closed');
    });
  }

  getRestaurants(): void {
    this.myBackendService.getRestaurants().subscribe(
      result => {
        this.restaurants = result;
      },
      error => {
        console.error('Error fetching restaurants:', error);
      }
    )
  }

  openRestaurantPage(restaurantName: string){
    this.router.navigateByUrl("/deals/" + restaurantName)
  }

}
