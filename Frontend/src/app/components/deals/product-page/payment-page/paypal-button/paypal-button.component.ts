import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../../../common/cart.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from '../../../../common/utils.service';
import { MyBackendService } from '../../../../common/my-backend.service';


declare var paypal: any;

@Component({
  selector: 'paypal-button',
  templateUrl: './paypal-button.component.html',
  styleUrl: './paypal-button.component.css'
})

export class PaypalButtonComponent implements OnInit {
@Input()
order!: any;

@ViewChild('paypal', {static: true})
paypalElement!:ElementRef;
reservation: boolean = false;

constructor(private cartService: CartService,
  private router:Router,
  public snackBar: MatSnackBar,
  public myBackendService: MyBackendService
) { }

  ngOnInit(): void {
    const self = this;
    paypal
    .Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: self.order.totalPayment,
              },
            },
          ],
        });
      },

      onApprove: async (data: any, actions: any) => {
        const payment = await actions.order.capture();
        this.order.paymentId = payment.id;
        self.myBackendService.pay(this.order._id, this.order, this.reservation).subscribe(
          {
            next: (orderId) => {
              this.cartService.clearCart();
              this.router.navigateByUrl('/track/' + this.order._id);
              UtilsService.openSnackBar('Payment saved successfully', this.snackBar, UtilsService.SnackbarStates.Success);
            },
            error: (error) => {
              UtilsService.openSnackBar('Payment Save Failed', this.snackBar, UtilsService.SnackbarStates.Error);
            }
          }
        );
      },

      onError: (err: any) => {
        UtilsService.openSnackBar('Payment Failed', this.snackBar, UtilsService.SnackbarStates.Error);
        console.log(err);
      },
    })
    .render(this.paypalElement.nativeElement);

  }
      
  }

