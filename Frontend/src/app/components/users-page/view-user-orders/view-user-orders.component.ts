import { Component, Inject, OnInit } from '@angular/core';
import { UserElement } from '../users-page.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { MyBackendService } from '../../common/my-backend.service';

export interface DialogData {
  user: UserElement;
}

@Component({
  selector: 'app-view-user-orders',
  templateUrl: './view-user-orders.component.html',
  styleUrl: './view-user-orders.component.css'
})


export class ViewUserOrdersComponent implements OnInit {

  orders: any[] = [];
  groupedOrders: { [key: string]: any[] } = {};
  orderValidity: { [orderId: string]: boolean } = {};
  orderInvalidReasons: { [orderId: string]: string } = {};

  constructor(public dialogRef: MatDialogRef<ViewUserOrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private myBackendService: MyBackendService) { }


  ngOnInit(): void {
      this.getOrdersbyEmail(this.data.user.email)
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

  getOrdersbyEmail(email: any): void {
    if (email) {
      this.myBackendService.getOrdersbyEmail(email).subscribe(
        async (result) => {
          this.orders = result.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
          this.groupedOrders = this.groupOrdersByDate(this.orders);
        },
        (error) => {
          console.error('Error fetching orders:', error);
        }
      );
    } else {
      console.error('Email is null, cannot fetch orders');
    }
  }

  getGroupKeys(groupedOrders: { [key: string]: any[] }): string[] {
    return Object.keys(groupedOrders).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
