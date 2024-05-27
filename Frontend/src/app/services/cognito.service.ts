import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user';
import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  private cognitoIdentityServiceProvider: AWS.CognitoIdentityServiceProvider;

  constructor() {
    Amplify.configure({
      Auth: environment.cognito
    });

    AWS.config.update({
      region: environment.cognito.region,
      credentials: new AWS.Credentials({
        accessKeyId: environment.awsAccessKeyId,
        secretAccessKey: environment.awsSecretAccessKey,
      })
    });

    this.cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
  }

  public signUp(user: User): Promise<any> {
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
    });
  }

  public confirmSignUp(user: User): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public async signIn(user: User): Promise<any> {
    try {
      await Auth.signIn(user.email, user.password);
      const accessToken = await this.getAccessToken();
      const idToken = await this.getIdToken();
      const role = await this.getRole();
      const email = await this.getEmail();
      if(role != undefined){
        localStorage.setItem('role', role);
      }
      if(email != undefined){
        localStorage.setItem('email', email);
      }
      if(idToken != null)
        {
      localStorage.setItem('idToken', idToken)
        }
      return accessToken;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  public signOut(): Promise<any> {
    return Auth.signOut();
  }

  public forgotPassword(user: User): Promise<any> {
    return Auth.forgotPassword(user.email);
  }

  public forgotPasswordSubmit(user: User, new_password: string): Promise<any> {
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
      const email = userInfo?.attributes['email'];
      return email || null;
    } catch (error) {
      console.error('Error retrieving email:', error);
      return null;
    }
  }

  async getGivenName(): Promise<string | null> {
    try {
      const userInfo = await Auth.currentUserInfo();
      const givenName = userInfo?.attributes['given_name'];
      return givenName || null;
    } catch (error) {
      console.error('Error retrieving given name:', error);
      return null;
    }
  }

  async getFamilyName(): Promise<string | null> {
    try {
      const userInfo = await Auth.currentUserInfo();
      const familyName = userInfo?.attributes['family_name'];
      return familyName || null;
    } catch (error) {
      console.error('Error retrieving family name:', error);
      return null;
    }
  }

  async getPhoneNumber(): Promise<string | null> {
    try {
      const userInfo = await Auth.currentUserInfo();
      const phoneNumber = userInfo?.attributes['phone_number'];
      return phoneNumber || null;
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

  public async listAllUsers(): Promise<any> {
    const params = {
      UserPoolId: environment.cognito.userPoolId,
      Limit: 60
    };

    try {
      const response = await this.cognitoIdentityServiceProvider.listUsers(params).promise();
      return response.Users;
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  }

  public async deleteUser(username: string): Promise<any> {
    const params = {
      UserPoolId: environment.cognito.userPoolId,
      Username: username
    };

    try {
      await this.cognitoIdentityServiceProvider.adminDeleteUser(params).promise();
      console.log(`User ${username} deleted successfully`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  public async deleteMultipleUsers(usernames: string[]): Promise<any> {
    const deletePromises = usernames.map(username => this.deleteUser(username));
    try {
      await Promise.all(deletePromises);
      console.log('All selected users deleted successfully');
    } catch (error) {
      console.error('Error deleting multiple users:', error);
      throw error;
    }
  }

  public async editUser(username: string, attributes: { [key: string]: string }): Promise<any> {
    const params = {
      UserPoolId: environment.cognito.userPoolId,
      Username: username,
      UserAttributes: Object.keys(attributes).map(key => ({
        Name: key,
        Value: attributes[key]
      }))
    };

    try {
      await this.cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
      console.log(`User ${username} updated successfully`);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  public async getAccessToken(): Promise<string | null> {
    try {
        const currentSession = await Auth.currentSession();
        const accessToken = currentSession.getAccessToken().getJwtToken();
        localStorage.setItem('accessToken', accessToken);
        return accessToken;
    } catch (error) {
        console.error('Error retrieving access token:', error);
        return null;
    }
}

  public getAccessTokenForAPI(): string | null {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      return accessToken;
    } else {
      console.error('Access token not available');
      return null;
    }
  }

  public async getIdToken(): Promise<string | null> {
    try {
      const currentSession = await Auth.currentSession();
      const idToken = currentSession.getIdToken().getJwtToken();
      return idToken;
    } catch (error) {
      console.error('Error decoding ID token:', error);
      return null
    }
  }
  
}
