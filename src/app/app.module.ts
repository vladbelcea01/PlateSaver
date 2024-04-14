import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { MessageModalComponent } from './components/message-modal/message-modal.component';
import { HomeComponent } from './components/home/home.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatAutocompleteModule} from '@angular/material/autocomplete'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { DealsComponent } from './components/deals/deals.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AddRestaurantComponent } from './components/deals/add-restaurant/add-restaurant/add-restaurant.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    MessageModalComponent,
    HomeComponent,
    DealsComponent,
    AppLayoutComponent,
    AddRestaurantComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatStepperModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSortModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
