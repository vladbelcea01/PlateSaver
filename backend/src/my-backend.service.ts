import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CognitoService } from '../../src/app/services/cognito.service';

@Injectable({
  providedIn: 'root'
})
export class MyBackendService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient, private router: Router,
    private cognitoService: CognitoService,
    
  ) {}

  private addAccessTokenToHeaders(): HttpHeaders {
    const accessToken = this.cognitoService.getAccessTokenForAPI();
    console.log('Access token:', accessToken);
    if (accessToken) {
      return new HttpHeaders({ 'Authorization': accessToken });
    }
    return new HttpHeaders();
  }

  saveRestaurant(restaurantData: any): Observable<any> {
    const url = `${this.baseUrl}/restaurants`;
    return this.http.post<any>(url, restaurantData);
  }

  getRestaurants(): Observable<any> {
    const url = `${this.baseUrl}/restaurantsList`;
    return this.http.get<any>(url);
  }

  getRestaurantbyRestaurantName(name: any): Observable<any> {
    const url = `${this.baseUrl}/getRestaurantbyName?name=${name}`;
    return this.http.get<any>(url);
  }

  saveDish(dishData: any): Observable<any> {
    const url = `${this.baseUrl}/dishes`;
    return this.http.post<any>(url, dishData);
  }

  getDish(restaurantName: any): Observable<any> {
    const url = `${this.baseUrl}/getDishes?name=${restaurantName}`;
    return this.http.get<any>(url);
  }

  deleteRestaurant(restaurantId: string, restaurantName: string, deleteProducts: boolean): Observable<any> {
    const url = `${this.baseUrl}/deleterestaurant/${restaurantId}?name=${restaurantName}`;
    const params = { deleteProducts: deleteProducts.toString() };
    return this.http.delete<any>(url, { params });
  }

  deleteProduct(productId: string): Observable<any> {
    const url = `${this.baseUrl}/deleteproduct/${productId}`;
    return this.http.delete<any>(url);
  }

  updateRestaurant(restaurantId: string, restaurantData: any): Observable<any> {
    const url = `${this.baseUrl}/updaterestaurant/${restaurantId}`;
    return this.http.put<any>(url, restaurantData);
  }

  updateProduct(productId: string, productData: any): Observable<any> {
    const url = `${this.baseUrl}/updateproduct/${productId}`;
    return this.http.put<any>(url, productData);
  }

  getAllDishes(): Observable<any> {
    const url = `${this.baseUrl}/DishesList`;
    return this.http.get<any>(url);
  }

  getProductbyProductName(name: any): Observable<any> {
    const url = `${this.baseUrl}/getDishbyName?name=${name}`;
    return this.http.get<any>(url);
  }

  saveOrder(orderData: any): Observable<any> {
    const url = `${this.baseUrl}/orders`;
    return this.http.post<any>(url, orderData);
  }

  getOrderbyProducts(products: any[]): Observable<any> {
    const url = `${this.baseUrl}/getOrderbyProducts`;
    return this.http.get<any>(url, { params: { products: JSON.stringify(products) } });
  }

  pay(order_id:string, order:any, reservation:boolean):Observable<string>{
    const url = `${this.baseUrl}/pay/${order_id}`;
    const requestBody = { ...order, reservation };
    return this.http.put<string>(url, requestBody);
  }

  getOrderbyId(id: string): Observable<any> {
    const url = `${this.baseUrl}/getOrderbyId?id=${id}`;
    return this.http.get<any>(url);
  }

  sendOrderEmail(orderData: any): Observable<any> {
    const url = `${this.baseUrl}/sendOrderEmail`;
    return this.http.post<any>(url, orderData);
  }

  getOrdersbyEmail(email: any): Observable<any> {
    const url = `${this.baseUrl}/getOrdersbyEmail?email=${email}`;
    return this.http.get<any>(url);
  }

  getDishbyId(id: any): Observable<any> {
    const url = `${this.baseUrl}/getDishbyId?id=${id}`;
    return this.http.get<any>(url);
  }

  deleteOrder(id: any): Observable<any> {
    const url = `${this.baseUrl}/deleteOrder?id=${id}`;
    return this.http.delete<any>(url);
  }

  getOrdersForSuperAdmin(): Observable<any> {
    const url = `${this.baseUrl}/ordersList`;
    return this.http.get<any>(url);
  }

  getRestaurantbyOwner(username: any): Observable<any> {
    const url = `${this.baseUrl}/getRestaurantbyOwner?username=${username}`;
    return this.http.get<any>(url);
  }

  getOrdersForAdmin(restaurant: any): Observable<any> {
    const url = `${this.baseUrl}/getOrdersbyRestaurantName?restaurant=${restaurant}`;
    return this.http.get<any>(url);
  }

}