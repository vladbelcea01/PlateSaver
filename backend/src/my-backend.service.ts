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
}
