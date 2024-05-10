import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MyBackendService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient, private router: Router) {}

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
}
