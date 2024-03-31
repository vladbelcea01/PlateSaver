import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../../services/cognito.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { error } from 'console';
import { AppLayoutComponent } from '../app-layout/app-layout.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {

  user: User | undefined;
  alertMessage:string = '';
  showAlert:boolean = false;

  isForgotPassword:boolean = false;
  newPassword:string = '';
  currentUserRole: string | null = null;
  forgotPassword:boolean = false;

  constructor(private router:Router,
    private cognitoService: CognitoService,
    private toolbar: AppLayoutComponent ) { }

  ngOnInit(): void {
    this.user = {} as User;
  }
  
  signInWithCognito() {
    if (this.user && this.user.email && this.user.password){
      this.cognitoService.signIn(this.user)
      .then(async () => {
        this.currentUserRole = await this.cognitoService.getRole();
        this.toolbar.signInRoleReceiver(this.currentUserRole);
        this.router.navigate(['/home']);
      })
      .catch((error:any) => {
        this.displayAlert(error.message);
      })
    }
    else{
      this.displayAlert("Please enter a valid email or password")
    }
  }

  forgotPasswordClicked(){
    if(this.user && this.user.email){
      this.cognitoService.forgotPassword(this.user)
      .then(() =>{
        this.forgotPassword = false;
        this.isForgotPassword = true;
      })
      .catch((error:any) =>{
        this.displayAlert(error.message);
      })
    }else{
      this.displayAlert("Please enter a valid email adress")
    }
  }

  openForgotPassword(){
    this.forgotPassword = true;
  }

  cancelForgotPassword(){
    this.forgotPassword = false;
  }

  newPasswordSubmit(){
    if(this.user && this.user.code && this.newPassword.trim().length != 0){
      this.cognitoService.forgotPasswordSubmit(this.user, this.newPassword.trim())
      .then(() =>{
        this.displayAlert("Password Updated");
        this.isForgotPassword = false;
      })
      .catch((error:any) => {
        this.displayAlert(error.message);
      })
    }else{
      this.displayAlert("Please enter valid input")
    }
  }

  private displayAlert(message:string){
    this.alertMessage = message;
    this.showAlert = true;
  }



}
