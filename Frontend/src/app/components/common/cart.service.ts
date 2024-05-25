import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../../models/Cart';
import { CartItem } from '../../models/CartItem';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-component/alert-component.component';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);
  constructor(public dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  addToCart(food: any, selectedQuantity: number): void {
    let cartItem = this.cart.items
      .find(item => item.food._id === food._id);

    if (cartItem)
      return;

    let newCartItem = this.cart.items
      .find(item => item.food.restaurant !=  food.restaurant)

    if(newCartItem){
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: {
          title: 'Cart Conflict',
          message:
            `You want to add to cart products from another restaurant which is prohibited.<br> 
            Do you want to add the new products and delete the old ones from the bascket?`,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.confirm) {
          this.clearCart();
          this.cart.items.push(new CartItem(food, selectedQuantity));
          this.setCartToLocalStorage();
        }
        else {
          return;
        }
      });
    }

    else{
    this.cart.items.push(new CartItem(food, selectedQuantity));
    this.setCartToLocalStorage();
    }
  }

  removeFromCart(foodId: string): void {
    this.cart.items = this.cart.items
      .filter(item => item.food._id != foodId);
    this.setCartToLocalStorage();
  }

  changeQuantity(foodId: string, quantity: number) {
    let cartItem = this.cart.items
      .find(item => item.food._id === foodId);
    if (!cartItem) return;

    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.newPrice;
    this.setCartToLocalStorage();
  }

  clearCart() {
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  private setCartToLocalStorage(): void {
    this.cart.totalPrice = this.cart.items
      .reduce((prevSum, currentItem) => prevSum + currentItem.price, 0);
    this.cart.totalCount = this.cart.items
      .reduce((prevSum, currentItem) => prevSum + currentItem.quantity, 0);

    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cartJson);
    this.cartSubject.next(this.cart);
  }

  private getCartFromLocalStorage(): Cart {
    if (isPlatformBrowser(this.platformId)) {
      const cartJson = localStorage.getItem('Cart');
      return cartJson ? JSON.parse(cartJson) : new Cart();
    }
    return new Cart();
  }

  getCart(): Cart{
    return this.cartSubject.value;
  }
}