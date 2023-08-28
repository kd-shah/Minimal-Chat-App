import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  
  constructor(private auth: AuthService, private router: Router){
  }

  
  user_name = this.auth.getName();
  onLogout(){
    this.auth.removetoken();
    this.router.navigate(['/login'])
  }
}
