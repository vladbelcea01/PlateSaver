import { Injectable } from '@angular/core';
import {Amplify,  Auth } from 'aws-amplify';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor() {
    Amplify.configure({
      Auth: environment.cognito
    })
  }

  public signUp(user:User): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
      attributes: {
        email: user.email,
        given_name: user.givenName,
        family_name: user.familyName,
        phone_number: user.phoneNumber,
        'custom:role': 'user'
      }
    })
  }

  public confirmSignUp(user:User): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code)
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public signIn(user: User): Promise<any> {
    return Auth.signIn(user.email, user.password)
  }

  public signOut(): Promise<any> {
    return Auth.signOut();
  }

  public forgotPassword(user:User): Promise<any> {
    return Auth.forgotPassword(user.email);
  }

  public forgotPasswordSubmit(user:User, new_password:string): Promise<any> {
    return Auth.forgotPasswordSubmit(user.email, user.code, new_password);
  }

  async getRole(): Promise<string | null> {
    try {
      const userInfo = await Auth.currentUserInfo();
      const role = userInfo?.attributes['custom:role'];
      return role || null;
    } catch (error) {
      console.error('Error retrieving role:', error);
      return null;
    }
  }

  async getEmail(): Promise<string | null> {
    try {
      const userInfo = await Auth.currentUserInfo();
      const role = userInfo?.attributes['email'];
      return role || null;
    } catch (error) {
      console.error('Error retrieving email:', error);
      return null;
    }
  }

  async getGivenName(): Promise<string | null> {
    try {
      const userInfo = await Auth.currentUserInfo();
      const role = userInfo?.attributes['given_name'];
      return role || null;
    } catch (error) {
      console.error('Error retrieving given name:', error);
      return null;
    }
  }

  async getFamilyName(): Promise<string | null> {
    try {
      const userInfo = await Auth.currentUserInfo();
      const role = userInfo?.attributes['family_name'];
      return role || null;
    } catch (error) {
      console.error('Error retrieving family name:', error);
      return null;
    }
  }

  async getPhoneNumber(): Promise<string | null> {
    try {
      const userInfo = await Auth.currentUserInfo();
      const role = userInfo?.attributes['phone_number'];
      return role || null;
    } catch (error) {
      console.error('Error retrieving phone number:', error);
      return null;
    }
  }

  public async updateUserAttributes(user: User): Promise<any> {
    try {
      const userAttributes = {
        email: user.email,
        given_name: user.givenName,
        family_name: user.familyName,
        phone_number: user.phoneNumber,
        'custom:role': user.role
      };
      return await Auth.updateUserAttributes(await Auth.currentAuthenticatedUser(), userAttributes);
    } catch (error) {
      console.error('Error updating user attributes:', error);
      throw error;
    }
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<string> {
    const user = await Auth.currentAuthenticatedUser();
    return Auth.changePassword(user, currentPassword, newPassword);
  }
  
}
