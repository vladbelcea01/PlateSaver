import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant/add-restaurant.component';
import { resourceLimits } from 'worker_threads';
import { AlertDialogComponent } from '../alert-component/alert-component.component';
import { EditRestaurantComponent } from './edit-restaurant/edit-restaurant.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from '../common/utils.service';
import { MyBackendService } from '../common/my-backend.service';

export interface DialogData {

}


@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrl: './deals.component.css',
})
export class DealsComponent implements OnInit {
  restaurants: any;
  currentUserRole: string | null = null;
  currentUserEmail: string | null = null;
  deleteProducts: boolean = false;
  isDataLoaded: boolean = false;
  allDishes: any[] = [];

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    public dialog: MatDialog,
    public myBackendService: MyBackendService,
    public snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getCurrentUserRole();
    await this.getCurrentUserEmail();
    this.getRestaurants();
    this.getAllDishes();
  }

  async getCurrentUserRole(): Promise<void> {
    this.currentUserRole = await this.cognitoService.getRole();
  }

  async getCurrentUserEmail(): Promise<void> {
    this.currentUserEmail = await this.cognitoService.getEmail();
  }

  addRestaurant() {
    const dialogRef = this.dialog.open(AddRestaurantComponent, {
      width: '600px',
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getRestaurants();
      console.log('The dialog was closed');
    });
  }

  getRestaurants(): void {
    this.myBackendService.getRestaurants().subscribe(
      (result) => {
        this.restaurants = result;
        this.isDataLoaded = true;
      },
      (error) => {
        console.error('Error fetching restaurants:', error);
      }
    );
  }

  openRestaurantPage(restaurantName: string) {
    this.router.navigateByUrl('/deals/' + restaurantName);
  }
  
  editRestaurant(restaurant: any) {
    const dialogRef = this.dialog.open(EditRestaurantComponent, {
      data: restaurant
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Restaurant edited successfully:', restaurant);
      window.location.reload();
    });
  }

  async getDishesbyRestaurantNameForDelete(restaurant: any): Promise<void> {
    await this.myBackendService.getDish(restaurant.name).subscribe(
      (result) => {
        let dishes = result;
        this.deleteRestaurantDishesAlert(restaurant, dishes);
      },
    );
  }

 async deleteRestaurantDishesAlert(restaurant: any, dishes: any): Promise<void> {
    if (dishes.length > 0) {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Delete Restaurant Products',
          message:
            'Restaurant has products assigned. Do you want also to delete the products?',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.confirm) {
          this.deleteProducts = true;
          this.deleteRestaurant(restaurant);
        }
        else {
          this.deleteRestaurant(restaurant);
        }
      });
    } else {
      this.deleteRestaurant(restaurant);
    }
  }

  deleteRestaurant(restaurant: any): void {
    this.myBackendService
      .deleteRestaurant(restaurant._id, restaurant.name, this.deleteProducts, restaurant.owner)
      .subscribe(
        () => {
          this.getRestaurants();
          this.deleteProducts = false;
          UtilsService.openSnackBar("Restaurant deleted successfully", this.snackBar, UtilsService.SnackbarStates.Success);
          console.log('Restaurant deleted successfully:', restaurant);
        },
        (error) => {
          UtilsService.openSnackBar("Error deleting restaurant", this.snackBar, UtilsService.SnackbarStates.Error);
          console.error('Error deleting restaurant:', error);
        }
      );
  }

getAllDishes(): void {
    this.myBackendService.getAllDishes().subscribe(
        (result) => {
            this.allDishes = result;
        }
    );
}

getDishesCount(restaurant: any): number {
  const dishesForRestaurant = this.allDishes.filter(dish => dish.restaurant === restaurant.name);
  return dishesForRestaurant.length;
}

}
