import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'src/app/Services/message.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages!: any[]
  @Input() userId: number | null = null;
  constructor(private route: ActivatedRoute, private message: MessageService, private auth: AuthService) { }

  loggedInUserId = this.auth.getUserId();

  ngOnInit() {
    this.route.params.subscribe(params => {
      const userId = +params['userId'];
      this.message.getMessages(userId).subscribe(response => {
        this.messages = response;
      });
    });
  }

}
