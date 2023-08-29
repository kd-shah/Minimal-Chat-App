import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { MessageService } from 'src/app/Services/message.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  
  selectedUserId: number | null = null;

  constructor(private auth: AuthService, private router: Router){
  }

  
  user_name = this.auth.getName();
  onLogout(){
    this.auth.removetoken();
    this.router.navigate(['/login'])
  }

  openChat(userId: number) {
    this.selectedUserId = userId;
  }

  
}
