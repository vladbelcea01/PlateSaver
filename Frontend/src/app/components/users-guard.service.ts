import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from 'aws-amplify';
import { CognitoService } from '../services/cognito.service';

@Injectable({
  providedIn: 'root'
})
export class UsersGuard implements CanActivate {
    currentUserRole: string | null = null;

  constructor(private router: Router,
    private cognitoService: CognitoService,
  ) {}

  async getCurrentUserRole(): Promise<void> {
    this.currentUserRole = await this.cognitoService.getRole();
  }

  async canActivate(): Promise<boolean> {
    try {
      await Auth.currentAuthenticatedUser();
      await this.getCurrentUserRole();

      if (this.currentUserRole === 'superadmin') {
        return true;
      } else {
        if (typeof window !== "undefined"){
        window.alert("Access denied. You do not have the required role.");
        }
        console.error('Access denied. User role is not superadmin');
        this.router.navigate(['/home']);
        return false;
      }
    } catch (error) {
      if (typeof window !== "undefined"){
      window.alert("User not authenticated!");
      }
      console.error('User not authenticated', error);
      this.router.navigate(['/home']);
      return false;
    }
  }
}
