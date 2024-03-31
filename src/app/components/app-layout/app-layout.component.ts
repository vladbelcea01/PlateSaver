import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../../services/cognito.service';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent {
  currentUserRole: string | null = null;

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.updateCurrentUserRole();
  }

  async updateCurrentUserRole(): Promise<void> {
    this.currentUserRole = await this.cognitoService.getRole();
    console.log(this.currentUserRole);
    this.cdr.detectChanges();
  }

  async signOutWithCognito(): Promise<void> {
    await this.cognitoService.signOut();
    this.router.navigate(['/sign-in']);
    this.currentUserRole = null;
    this.cdr.detectChanges();
  }

  signInRoleReceiver(role:string | null){
    this.currentUserRole = role;
  }
}
