import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { ButtonModule, InputTextModule, MessagesModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { BlankComponent } from './blank.component';
import { LandingComponent } from './components/landing/landing.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';

const appRoutes: Routes = [
    { component: BlankComponent, path: '' },
    { component: LandingComponent, path: 'landing' },
    { component: RegisterComponent, path: 'register' }
];

@NgModule({
  declarations: [
    AppComponent,
    BlankComponent,
    LandingComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    ButtonModule,
    InputTextModule,
    MessagesModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
