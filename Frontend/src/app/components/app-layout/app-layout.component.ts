import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';
import { CartService } from '../common/cart.service';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent {
  currentUserRole: string | null = null;
  cartQuantity=0;

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private cdr: ChangeDetectorRef,
    private cartService:CartService,
  ) { 
    cartService.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart.totalCount;
    })
  }

  async ngOnInit(): Promise<void> {
    await this.updateCurrentUserRole();
  }

  async updateCurrentUserRole(): Promise<void> {
    this.currentUserRole = await this.cognitoService.getRole();
    console.log(this.currentUserRole);
    this.cdr.detectChanges();
  }

  async signOutWithCognito(): Promise<void> {
    this.cartService.clearCart();
    await this.cognitoService.signOut();
    this.router.navigate(['/sign-in']);
    this.currentUserRole = null;
    this.cdr.detectChanges();
  }

  signInRoleReceiver(role:string | null){
    this.currentUserRole = role;
  }

  goCart(): void {
    this.router.navigateByUrl('/cart');
  }
}
