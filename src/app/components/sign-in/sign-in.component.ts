import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../../services/cognito.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { error } from 'console';

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

  constructor(private router:Router,
    private cognitoService: CognitoService) { }

  ngOnInit(): void {
    this.user = {} as User;
  }
  
  signInWithCognito() {
    if (this.user && this.user.email && this.user.password){
      this.cognitoService.signIn(this.user)
      .then(() => {
        this.router.navigate(['/']);
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
        this.isForgotPassword = true;
      })
      .catch((error:any) =>{
        this.displayAlert(error.message);
      })
    }else{
      this.displayAlert("Please enter a valid email adress")
    }
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
