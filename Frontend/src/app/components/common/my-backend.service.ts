import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class MyBackendService {
  private baseUrl = 'http://localhost:5000'
  role = localStorage.getItem('role')
  email = localStorage.getItem('email')

  constructor(private http: HttpClient, private router: Router,
    private cognitoService: CognitoService,
    
  ) {}

  private addAccessTokenToHeaders(): HttpHeaders {
    const accessToken = this.cognitoService.getAccessTokenForAPI();
    console.log('Access token:', accessToken);
    if (accessToken) {
      return new HttpHeaders({ 'Authorization': `Bearer ${accessToken}` });
    }
    return new HttpHeaders();
  }

  saveRestaurant(restaurantData: any): Observable<any> {
    const url = `${this.baseUrl}/api/restaurants`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.post<any>(url, restaurantData, { headers });
  }

  getRestaurants(): Observable<any> {
    const url = `${this.baseUrl}/api/restaurantsList`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.get<any>(url, { headers });
  }

  getRestaurantbyRestaurantName(name: any): Observable<any> {
    const url = `${this.baseUrl}/api/getRestaurantbyName?name=${name}`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.get<any>(url, { headers });
  }

  saveDish(dishData: any): Observable<any> {
    const url = `${this.baseUrl}/api/dishes`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.post<any>(url, dishData, { headers });
  }

  getDish(restaurantName: any): Observable<any> {
    const url = `${this.baseUrl}/api/getDishes?name=${restaurantName}`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.get<any>(url, { headers });
  }

  deleteRestaurant(restaurantId: string, restaurantName: string, deleteProducts: boolean): Observable<any> {
    const url = `${this.baseUrl}/api/deleterestaurant/${restaurantId}?name=${restaurantName}`;
    const params = { deleteProducts: deleteProducts.toString() };
    const headers = this.addAccessTokenToHeaders();
    return this.http.delete<any>(url, { params, headers });
  }

  deleteProduct(productId: string): Observable<any> {
    const url = `${this.baseUrl}/api/deleteproduct/${productId}`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.delete<any>(url, { headers });
  }

  updateRestaurant(restaurantId: string, restaurantData: any): Observable<any> {
    const url = `${this.baseUrl}/api/updaterestaurant/${restaurantId}`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.put<any>(url, restaurantData, { headers });
  }

  updateProduct(productId: string, productData: any): Observable<any> {
    const url = `${this.baseUrl}/api/updateproduct/${productId}`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.put<any>(url, productData, { headers });
  }

  getAllDishes(): Observable<any> {
    const url = `${this.baseUrl}/api/DishesList`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.get<any>(url, { headers });
  }

  getProductbyProductName(name: any): Observable<any> {
    const url = `${this.baseUrl}/api/getDishbyName?name=${name}`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.get<any>(url, { headers });
  }

  saveOrder(orderData: any): Observable<any> {
    const url = `${this.baseUrl}/api/orders`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.post<any>(url, orderData, { headers });
  }

  getOrderbyProducts(products: any[]): Observable<any> {
    const url = `${this.baseUrl}/api/getOrderbyProducts`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.get<any>(url, { params: { products: JSON.stringify(products) }, headers });
  }

  pay(order_id:string, order:any, reservation:boolean):Observable<string>{
    const url = `${this.baseUrl}/api/pay/${order_id}`;
    const requestBody = { ...order, reservation };
    const headers = this.addAccessTokenToHeaders();
    return this.http.put<string>(url, requestBody, { headers });
  }

  getOrderbyId(id: string): Observable<any> {
    const url = `${this.baseUrl}/api/getOrderbyId?id=${id}`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.get<any>(url, { headers });
  }

  sendOrderEmail(orderData: any): Observable<any> {
    const url = `${this.baseUrl}/api/sendOrderEmail`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.post<any>(url, orderData, { headers });
  }

  getOrdersbyEmail(email: any): Observable<any> {
    const url = `${this.baseUrl}/api/getOrdersbyEmail?email=${email}`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.get<any>(url, { headers });
  }

  getDishbyId(id: any): Observable<any> {
    const url = `${this.baseUrl}/api/getDishbyId?id=${id}`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.get<any>(url, { headers });
  }

  deleteOrder(id: any): Observable<any> {
    const url = `${this.baseUrl}/api/deleteOrder?id=${id}`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.delete<any>(url, { headers});
  }

  getOrdersForSuperAdmin(): Observable<any> {
    const url = `${this.baseUrl}/api/ordersList`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.get<any>(url, { headers });
  }

  getRestaurantbyOwner(username: any): Observable<any> {
    const url = `${this.baseUrl}/api/getRestaurantbyOwner?username=${username}`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.get<any>(url, { headers });
  }

  getOrdersForAdmin(restaurant: any): Observable<any> {
    const url = `${this.baseUrl}/api/getOrdersbyRestaurantName?restaurant=${restaurant}`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.get<any>(url, { headers });
  }

}