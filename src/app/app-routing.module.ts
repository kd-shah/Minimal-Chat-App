import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './Components/SignIn/register/register.component';
import { LoginComponent } from './Components/SignIn/login/login.component';
import { DashboardComponent } from './Components/Chat/dashboard/dashboard.component';
import { AuthGuard } from './Guards/auth.guard';

const routes: Routes = [{ path: 'register', component: RegisterComponent },
{ path: 'login', component: LoginComponent },
{ path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
