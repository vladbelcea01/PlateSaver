import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CognitoService } from '../../../services/cognito.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { UtilsService } from '../../common/utils.service';
import { CartService } from '../../common/cart.service';
import { MyBackendService } from '../../common/my-backend.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent implements OnInit {
  currentUserRole: string | null = null;
  restaurantName!: string;
  productName!: string;
  restaurant: any;
  product: any;
  isSuperAdminOrOwner: boolean = false;
  currentUserEmail: string | null = null;
  selectedQuantity: number = 1;

  constructor(
    public dialog: MatDialog,
    public myBackendService: MyBackendService,
    private cognitoService: CognitoService,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private cartService:CartService
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (params) => {
      this.productName = params['product'];
      this.restaurantName = params['name'];
      await this.getProductbyName(this.productName);
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

  async getProductbyName(productName: string): Promise<void> {
    await this.myBackendService
      .getProductbyProductName(productName)
      .subscribe(
        (result) => {
          this.product = result;
        },
        (error) => {
          console.error('Error fetching restaurants:', error);
        }
      );
  }

  editProduct() {
    const dialogRef = this.dialog.open(EditProductComponent, {
      data: this.product,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Product edited successfully:', this.product);
    });
  }

  deleteProduct() {
    this.myBackendService.deleteProduct(this.product._id, this.restaurant.owner).subscribe(
      () => {
        UtilsService.openSnackBar("Product deleted successfully", this.snackBar, UtilsService.SnackbarStates.Success);
        this.goBack();
        console.log('Product deleted successfully:', this.product);
      },
      (error) => {
        UtilsService.openSnackBar("Error deleting product", this.snackBar, UtilsService.SnackbarStates.Error);
        console.error('Error deleting product:', error);
      }
    );
  }

  goBack(): void {
    this.router.navigateByUrl('/deals/' + this.restaurant.name);
  }

  incrementQuantity() {
    if (this.selectedQuantity < this.product.quantity) {
      this.selectedQuantity++;
    }
  }

  decrementQuantity() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  addToCart(){
    this.cartService.addToCart(this.product, this.selectedQuantity);
    this.router.navigateByUrl('/cart');
  }

}
