import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from './add-product/add-product.component';
import { CognitoService } from '../../../../services/cognito.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertDialogComponent } from '../../../alert-component/alert-component.component';
import { EditRestaurantComponent } from '../../edit-restaurant/edit-restaurant.component';
import { EditProductComponent } from '../../edit-product/edit-product.component';
import { RestaurantInfoComponent } from './restaurant-info/restaurant-info.component';
import { UtilsService } from '../../../common/utils.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyBackendService } from '../../../common/my-backend.service';

@Component({
  selector: 'app-restaurant-page',
  templateUrl: './restaurant-page.component.html',
  styleUrl: './restaurant-page.component.css',
})
export class RestaurantPageComponent implements OnInit {
  currentUserRole: string | null = null;
  restaurantName!: string;
  restaurant: any;
  products: any;
  isSuperAdminOrOwner: boolean = false;
  currentUserEmail: string | null = null;
  deleteProducts: boolean = false;

  constructor(
    public dialog: MatDialog,
    public myBackendService: MyBackendService,
    private cognitoService: CognitoService,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (params) => {
      this.restaurantName = params['name'];
      await this.getRestaurantbyName(this.restaurantName);
    });
    await this.getCurrentUserRole();
    await this.getCurrentUserEmail();
    if (
      this.currentUserRole == 'superadmin' ||
      this.restaurant['owner'] == this.currentUserEmail
    ) {
      this.isSuperAdminOrOwner = true;
    }
    this.getProducts();
  }

  async getCurrentUserRole(): Promise<void> {
    this.currentUserRole = await this.cognitoService.getRole();
  }

  async getCurrentUserEmail(): Promise<void> {
    this.currentUserEmail = await this.cognitoService.getEmail();
  }

  async getRestaurantbyName(restaurantName: string): Promise<void> {
    await this.myBackendService
      .getRestaurantbyRestaurantName(restaurantName)
      .subscribe(
        (result) => {
          this.restaurant = result;
        },
        (error) => {
          console.error('Error fetching restaurants:', error);
        }
      );
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddProductComponent, {
      data: this.restaurantName,
      width: '600px',
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getProducts();
      console.log('The dialog was closed');
    });
  }

  getProducts(): void {
    this.myBackendService.getDish(this.restaurantName).subscribe(
      (result) => {
        this.products = result;
      },
      (error) => {
        console.error('Error fetching restaurants:', error);
      }
    );
  }

  editProduct(product: any) {
    const dialogRef = this.dialog.open(EditProductComponent, {
      data: product,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Product edited successfully:', product);
      this.getProducts();
    });
  }

  deleteProduct(product: any) {
    this.myBackendService.deleteProduct(product._id).subscribe(
      () => {
        UtilsService.openSnackBar("Product deleted successfully", this.snackBar, UtilsService.SnackbarStates.Success);
        this.getProducts();
        console.log('Product deleted successfully:', product);
      },
      (error) => {
        UtilsService.openSnackBar("Error deleting product", this.snackBar, UtilsService.SnackbarStates.Error);
        console.error('Error deleting product:', error);
      }
    );
  }

  editRestaurant(restaurant: any) {
    const dialogRef = this.dialog.open(EditRestaurantComponent, {
      data: restaurant,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Restaurant edited successfully:', restaurant);
      this.router.navigateByUrl('/deals/' + result.name);
    });
  }

  async deleteRestaurantDishesAlert(restaurant: any): Promise<void> {
    console.log(this.products.length)
    if (this.products.length > 0) {
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
        } else {
          this.deleteRestaurant(restaurant);
        }
      });
    } else {
      this.deleteRestaurant(restaurant);
    }
  }

  deleteRestaurant(restaurant: any): void {
    this.myBackendService
      .deleteRestaurant(restaurant._id, restaurant.name, this.deleteProducts)
      .subscribe(
        () => {
          this.router.navigate(['/deals']);
          UtilsService.openSnackBar("Restaurant saved successfully", this.snackBar, UtilsService.SnackbarStates.Success);
          console.log('Restaurant deleted successfully:', restaurant);
        },
        (error) => {
          UtilsService.openSnackBar("Error saving restaurant", this.snackBar, UtilsService.SnackbarStates.Error);
          console.error('Error deleting restaurant:', error);
        }
      );
  }

  goBack(): void {
    this.router.navigateByUrl('/deals');
  }

  openRestaurantInfo(): void {
    const dialogRef = this.dialog.open(RestaurantInfoComponent, {
      data: this.restaurant,
      width: '600px'
    });
  }

  openProductPage(productName: string) {
    this.router.navigateByUrl('/deals/' + this.restaurantName + '/' + productName);
  }

}

