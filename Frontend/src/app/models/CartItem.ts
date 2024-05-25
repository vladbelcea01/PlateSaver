export class CartItem{
  constructor(public food:any, public selectedQuantity: number){ }
  quantity:number = this.selectedQuantity;
  price: number = this.food.newPrice * this.quantity;
}