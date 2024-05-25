import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class MyBackendService {
  private baseUrl =environment.production? '' : 'http://localhost:5000';

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
    const url = `${this.baseUrl}/api/restaurants`;
    return this.http.post<any>(url, restaurantData);
  }

  getRestaurants(): Observable<any> {
    const url = `${this.baseUrl}/api/restaurantsList`;
    return this.http.get<any>(url);
  }

  getRestaurantbyRestaurantName(name: any): Observable<any> {
    const url = `${this.baseUrl}/api/getRestaurantbyName?name=${name}`;
    return this.http.get<any>(url);
  }

  saveDish(dishData: any): Observable<any> {
    const url = `${this.baseUrl}/api/dishes`;
    return this.http.post<any>(url, dishData);
  }

  getDish(restaurantName: any): Observable<any> {
    const url = `${this.baseUrl}/api/getDishes?name=${restaurantName}`;
    return this.http.get<any>(url);
  }

  deleteRestaurant(restaurantId: string, restaurantName: string, deleteProducts: boolean): Observable<any> {
    const url = `${this.baseUrl}/api/deleterestaurant/${restaurantId}?name=${restaurantName}`;
    const params = { deleteProducts: deleteProducts.toString() };
    return this.http.delete<any>(url, { params });
  }

  deleteProduct(productId: string): Observable<any> {
    const url = `${this.baseUrl}/api/deleteproduct/${productId}`;
    return this.http.delete<any>(url);
  }

  updateRestaurant(restaurantId: string, restaurantData: any): Observable<any> {
    const url = `${this.baseUrl}/api/updaterestaurant/${restaurantId}`;
    return this.http.put<any>(url, restaurantData);
  }

  updateProduct(productId: string, productData: any): Observable<any> {
    const url = `${this.baseUrl}/api/updateproduct/${productId}`;
    return this.http.put<any>(url, productData);
  }

  getAllDishes(): Observable<any> {
    const url = `${this.baseUrl}/api/DishesList`;
    return this.http.get<any>(url);
  }

  getProductbyProductName(name: any): Observable<any> {
    const url = `${this.baseUrl}/api/getDishbyName?name=${name}`;
    return this.http.get<any>(url);
  }

  saveOrder(orderData: any): Observable<any> {
    const url = `${this.baseUrl}/api/orders`;
    return this.http.post<any>(url, orderData);
  }

  getOrderbyProducts(products: any[]): Observable<any> {
    const url = `${this.baseUrl}/api/getOrderbyProducts`;
    return this.http.get<any>(url, { params: { products: JSON.stringify(products) } });
  }

  pay(order_id:string, order:any, reservation:boolean):Observable<string>{
    const url = `${this.baseUrl}/api/pay/${order_id}`;
    const requestBody = { ...order, reservation };
    return this.http.put<string>(url, requestBody);
  }

  getOrderbyId(id: string): Observable<any> {
    const url = `${this.baseUrl}/api/getOrderbyId?id=${id}`;
    return this.http.get<any>(url);
  }

  sendOrderEmail(orderData: any): Observable<any> {
    const url = `${this.baseUrl}/api/sendOrderEmail`;
    return this.http.post<any>(url, orderData);
  }

  getOrdersbyEmail(email: any): Observable<any> {
    const url = `${this.baseUrl}/api/getOrdersbyEmail?email=${email}`;
    return this.http.get<any>(url);
  }

  getDishbyId(id: any): Observable<any> {
    const url = `${this.baseUrl}/api/getDishbyId?id=${id}`;
    return this.http.get<any>(url);
  }

  deleteOrder(id: any): Observable<any> {
    const url = `${this.baseUrl}/api/deleteOrder?id=${id}`;
    return this.http.delete<any>(url);
  }

  getOrdersForSuperAdmin(): Observable<any> {
    const url = `${this.baseUrl}/api/ordersList`;
    return this.http.get<any>(url);
  }

  getRestaurantbyOwner(username: any): Observable<any> {
    const url = `${this.baseUrl}/api/getRestaurantbyOwner?username=${username}`;
    return this.http.get<any>(url);
  }

  getOrdersForAdmin(restaurant: any): Observable<any> {
    const url = `${this.baseUrl}/api/getOrdersbyRestaurantName?restaurant=${restaurant}`;
    return this.http.get<any>(url);
  }

}