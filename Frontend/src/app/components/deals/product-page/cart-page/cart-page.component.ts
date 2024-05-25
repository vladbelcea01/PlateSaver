import { Component, OnInit } from '@angular/core';
import { Cart } from '../../../../models/Cart';
import { CartService } from '../../../common/cart.service';
import { CartItem } from '../../../../models/CartItem';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent implements OnInit {
  cart!: Cart;
  constructor(private cartService: CartService) {
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
    })
   }

  ngOnInit(): void {
  }

  removeFromCart(cartItem:CartItem){
    this.cartService.removeFromCart(cartItem.food._id);
  }

  changeQuantity(cartItem:CartItem,quantityInString:string){
    const quantity = parseInt(quantityInString);
    this.cartService.changeQuantity(cartItem.food._id, quantity);
  }

  generateNumbers(quantity: number): string[] {
    return Array.from({ length: quantity }, (_, i) => (i + 1).toString());
  }

  removeAll(){
    this.cartService.clearCart();
  }
  
}
