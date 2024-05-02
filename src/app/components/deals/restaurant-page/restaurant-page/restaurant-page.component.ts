import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MyBackendService } from '../../../../../../backend/src/my-backend.service';
import { AddProductComponent } from './add-product/add-product.component';
import { CognitoService } from '../../../../services/cognito.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restaurant-page',
  templateUrl: './restaurant-page.component.html',
  styleUrl: './restaurant-page.component.css'
})
export class RestaurantPageComponent implements OnInit {
  currentUserRole: string | null = null;
  restaurantName!: string;
  restaurant: any;

  constructor(public dialog: MatDialog,
    public myBackendService: MyBackendService,
    private cognitoService: CognitoService,
    private route: ActivatedRoute,) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.restaurantName = params['name'];
      this.getRestaurantbyName(this.restaurantName);
    });
      this.updateCurrentUserRole();
  }

  async updateCurrentUserRole(): Promise<void> {
    this.currentUserRole = await this.cognitoService.getRole();
  }

  getRestaurantbyName(restaurantName: string): void {
    this.myBackendService.getRestaurantbyRestaurantName(restaurantName).subscribe(
      result => {
        this.restaurant = result;
      },
      error => {
        console.error('Error fetching restaurants:', error);
      }
    )
  }

  addProduct(){
    const dialogRef = this.dialog.open(AddProductComponent, {
      data: this.restaurantName,
      width: '600px',
      height: 'auto',

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
