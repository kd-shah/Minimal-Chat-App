import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './Components/SignIn/register/register.component';
import { LoginComponent } from './Components/SignIn/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './Components/Chat/dashboard/dashboard.component';
import { AuthGuard } from './Guards/auth.guard';
import { TokenInterceptor } from './Interceptors/token.interceptor';
import { UserListComponent } from './Components/Chat/user-list/user-list.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
