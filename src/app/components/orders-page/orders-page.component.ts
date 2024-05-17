import { Component, OnInit } from '@angular/core';
import { MyBackendService } from '../../../../backend/src/my-backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';
import { AlertDialogComponent } from '../alert-component/alert-component.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from '../common/utils.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css'],
})
export class OrdersPageComponent implements OnInit {
  orders: any[] = [];
  groupedOrders: { [key: string]: any[] } = {};
  orderValidity: { [orderId: string]: boolean } = {};
  orderInvalidReasons: { [orderId: string]: string } = {};
  currentUserEmail: string | null = null;
  currentUserRole: string | null = null;

  constructor(
    private myBackendService: MyBackendService,
    private route: ActivatedRoute,
    private router: Router,
    private cognitoService: CognitoService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getCurrentUserEmail();
    await this.getCurrentUserRole();
    if (this.currentUserRole === 'user') {
      this.getOrdersbyEmail(this.currentUserEmail);
    } else if (this.currentUserRole === 'admin') {
      this.getOrdersForAdmin();
    } else if (this.currentUserRole === 'superadmin') {
      this.getOrdersForSuperAdmin();
    }
  }

  async getCurrentUserEmail(): Promise<void> {
    try {
      this.currentUserEmail = await this.cognitoService.getEmail();
    } catch (error) {
      console.error('Error fetching user email:', error);
    }
  }

  async getCurrentUserRole(): Promise<void> {
    this.currentUserRole = await this.cognitoService.getRole();
  }

  getOrdersbyEmail(email: any): void {
    if (email) {
      this.myBackendService.getOrdersbyEmail(email).subscribe(
        async (result) => {
          this.orders = result.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
          this.groupedOrders = this.groupOrdersByDate(this.orders);
          for (const order of this.orders) {
            const isValid = await this.isOrderStillValid(order);
            this.orderValidity[order._id] = isValid;
          }
        },
        (error) => {
          console.error('Error fetching orders:', error);
        }
      );
    } else {
      console.error('Email is null, cannot fetch orders');
    }
  }

  getOrdersForAdmin(): void {
    this.myBackendService.getRestaurantbyOwner(this.currentUserEmail).subscribe(
      (restaurant) => {
        this.myBackendService.getOrdersForAdmin(restaurant.name).subscribe(
          async (result) => {
            this.orders = result.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
            this.groupedOrders = this.groupOrdersByDate(this.orders);
            for (const order of this.orders) {
              const isValid = await this.isOrderStillValid(order);
              this.orderValidity[order._id] = isValid;
            }
          },
          (error) => {
            console.error('Error fetching orders for admin:', error);
          }
        );
      }
    )
    
  }

  getOrdersForSuperAdmin(): void {
    this.myBackendService.getOrdersForSuperAdmin().subscribe(
      async (result) => {
        this.orders = result.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
        this.groupedOrders = this.groupOrdersByDate(this.orders);
        for (const order of this.orders) {
          const isValid = await this.isOrderStillValid(order);
          this.orderValidity[order._id] = isValid;
        }
      },
      (error) => {
        console.error('Error fetching orders for superadmin:', error);
      }
    );
  }

  groupOrdersByDate(orders: any[]): { [key: string]: any[] } {
    return orders.reduce((groups, order) => {
      const date = formatDate(order.orderDate, 'yyyy-MM-dd', 'en-US');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(order);
      return groups;
    }, {});
  }

  async isOrderStillValid(order: any): Promise<boolean> {
    try {
      if (order.payed === 'Paid') {
        this.orderInvalidReasons[order._id] = 'Order is already paid.';
        return false;
      }

      const restaurant = await this.myBackendService
        .getRestaurantbyRestaurantName(order.products[0].food.restaurant)
        .toPromise();

      if (restaurant.paymentMethod === 'Cash Only' && order.reserved === 'Reserved') {
        this.orderInvalidReasons[order._id] = 'Payment is only accepted in cash at this restaurant.';
        return false;
      }

      const productChecks = order.products.map(async (product: any) => {
        const dish = await this.myBackendService
          .getDishbyId(product.food._id)
          .toPromise();
        if (dish.quantity < product.quantity) {
          return false;
        }
        return true;
      });

      const results = await Promise.all(productChecks);
      if (!results.every((isValid) => isValid)) {
        this.orderInvalidReasons[order._id] = 'One or more items in the order are out of stock.';
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking order validity:', error);
      this.orderInvalidReasons[order._id] = 'There was an error checking the order validity.';
      return false;
    }
  }

  gotoPayment(id: string): void {
    this.router.navigateByUrl('/payment/' + id);
  }

  cancelReservation(id: any) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'Delete Order',
        message: 'Are you sure you want to cancel/delete this order? ',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.confirm) {
        this.myBackendService.deleteOrder(id).subscribe(
          () => {
            this.getOrdersbyEmail(this.currentUserEmail);
            UtilsService.openSnackBar("Order deleted successfully", this.snackBar, UtilsService.SnackbarStates.Success);
          },
          (error) => {
            UtilsService.openSnackBar("Error deleting order", this.snackBar, UtilsService.SnackbarStates.Error);
            console.error('Error deleting product:', error);
          }
        );
      }
    });
  }

  getGroupKeys(groupedOrders: { [key: string]: any[] }): string[] {
    return Object.keys(groupedOrders).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }
}
