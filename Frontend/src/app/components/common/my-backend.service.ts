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
 // private baseUrl = 'http://localhost:5000'
 private baseUrl = ''

  constructor(private http: HttpClient, private router: Router,
    private cognitoService: CognitoService,
    
  ) {}

  private addAccessTokenToHeaders(): HttpHeaders {
    const accessToken = this.cognitoService.getAccessTokenForAPI();
    const idToken =  localStorage.getItem('idToken')
    let headers = new HttpHeaders();
    if (accessToken) {
      headers = headers.set('Authorization', `Bearer ${accessToken}`);
    }
    if (idToken) {
      headers = headers.set('idToken', idToken);
    }
    return headers
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

  saveDish(dishData: any, owner: any): Observable<any> {
    const url = `${this.baseUrl}/api/dishes`;
    let headers = this.addAccessTokenToHeaders();
    if (owner) {
      headers = headers.set('Owner', owner);
    }
    return this.http.post<any>(url, dishData, { headers });
  }

  getDish(restaurantName: any): Observable<any> {
    const url = `${this.baseUrl}/api/getDishes?name=${restaurantName}`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.get<any>(url, { headers });
  }

  deleteRestaurant(restaurantId: string, restaurantName: string, deleteProducts: boolean, owner: any): Observable<any> {
    const url = `${this.baseUrl}/api/deleterestaurant/${restaurantId}?name=${restaurantName}`;
    const params = { deleteProducts: deleteProducts.toString() };
    let headers = this.addAccessTokenToHeaders();
    if (owner) {
      headers = headers.set('Owner', owner);
    }
    return this.http.delete<any>(url, { params, headers });
  }

  deleteProduct(productId: string, owner: any): Observable<any> {
    const url = `${this.baseUrl}/api/deleteproduct/${productId}`;
    let headers = this.addAccessTokenToHeaders();
    if (owner) {
      headers = headers.set('Owner', owner);
    }
    return this.http.delete<any>(url, { headers });
  }

  updateRestaurant(restaurantId: string, restaurantData: any): Observable<any> {
    const url = `${this.baseUrl}/api/updaterestaurant/${restaurantId}`;
    const headers = this.addAccessTokenToHeaders();
    return this.http.put<any>(url, restaurantData, { headers });
  }

  updateProduct(productId: string, productData: any, owner: any): Observable<any> {
    const url = `${this.baseUrl}/api/updateproduct/${productId}`;
    let headers = this.addAccessTokenToHeaders();
    if (owner) {
      headers = headers.set('Owner', owner);
    }
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