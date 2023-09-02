import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'src/app/Services/message.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

  public users: any =[];
  
  constructor(private user: UserService ){
  }


  ngOnInit(){
    this.user.getUsers()
    .subscribe(response => {
      this.users = response.users;
      console.log(response);
    })
  }

  
}
