import { Component } from '@angular/core';
import { UserService } from 'src/app/Services/user.service';
import { User } from 'src/app/Components/Chat/user-list/model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

  users!: User[] ;
  
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
