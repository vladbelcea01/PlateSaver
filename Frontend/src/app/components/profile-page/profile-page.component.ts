import { Component, OnDestroy, OnInit } from '@angular/core';
import { CognitoService } from '../../services/cognito.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from '../common/utils.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  user: User = {
    email: '',
    givenName: '',
    familyName: '',
    phoneNumber: '',
    role: '',
    password: '',
    code: '',
    showPassword: false
  };
  editableUser: User = { ...this.user };
  isEditMode: boolean = false;
  isChangePasswordModalOpen: boolean = false;
  currentPassword: string = '';
  newPassword: string = '';

  constructor(
    private cognitoService: CognitoService,
    private snackBar: MatSnackBar
  ) {
    this.loadBootstrap();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.removeBootstrap();
  }

  async loadUserProfile(): Promise<void> {
    try {
      const userInfo = await this.cognitoService.getUser();
      this.user.email = userInfo.attributes.email;
      this.user.givenName = userInfo.attributes.given_name;
      this.user.familyName = userInfo.attributes.family_name;
      this.user.phoneNumber = userInfo.attributes.phone_number;
      this.user.role = userInfo.attributes['custom:role'];
      this.editableUser = { ...this.user };
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  loadBootstrap(): void {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
    head.appendChild(link);
  }

  removeBootstrap(): void {
    const links = document.getElementsByTagName('link');
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      if (link.href && link.href.includes('bootstrap.min.css')) {
        const parentNode = link.parentNode;
        if (parentNode) {
          parentNode.removeChild(link);
        }
      }
    }
  }
  
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  async onSubmit(): Promise<void> {
    try {
      await this.cognitoService.updateUserAttributes(this.editableUser);
      this.user = { ...this.editableUser };
      this.toggleEditMode();
      UtilsService.openSnackBar('Profile updated successfully', this.snackBar, UtilsService.SnackbarStates.Success);
    } catch (error) {
      UtilsService.openSnackBar('Error updating profile', this.snackBar, UtilsService.SnackbarStates.Error);
      console.error('Error updating profile:', error);
    }
  }

  cancelEdit(): void {
    this.editableUser = { ...this.user };
    this.toggleEditMode();
  }

  openChangePasswordModal(): void {
    this.isChangePasswordModalOpen = true;
  }

  closeChangePasswordModal(): void {
    this.isChangePasswordModalOpen = false;
    this.currentPassword = '';
    this.newPassword = '';
  }

  async onChangePassword(): Promise<void> {
    try {
      const result = await this.cognitoService.changePassword(this.currentPassword, this.newPassword);
      this.closeChangePasswordModal();
      UtilsService.openSnackBar(result, this.snackBar, UtilsService.SnackbarStates.Success);
    } catch (error) {
      UtilsService.openSnackBar('Error changing password', this.snackBar, UtilsService.SnackbarStates.Error);
      console.error('Error changing password:', error);
    }
  }
}
