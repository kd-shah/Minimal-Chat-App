import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MessageService } from 'src/app/Services/message.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';


interface Message {
  id: number,
  senderId: any,
  receiverId: number,
  content: string,
  timestamp: string,
  isEditing: boolean;

}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {


  messages!: Message[]

  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuMessage: Message | null = null;

  sendForm!: FormGroup
  sentMessage: any;

  editForm!: FormGroup;


  loggedInUserId = this.auth.getUserId();


  constructor(private route: ActivatedRoute,
    private message: MessageService,
    private auth: AuthService,
    private fb: FormBuilder) { }


  ngOnInit() {
    this.route.params.subscribe(params => {
      const userId = +params['userId'];
      this.message.receiverId = userId;
      this.message.getMessages(userId).subscribe((response: any[]) => {
        this.messages = response.map((msg: Message) => ({
          ...msg,
          isEditing: false,
        }))
      }
      );
    });

    this.sendForm = this.fb.group({
      message: ['', Validators.required]
    })

    this.editForm = this.fb.group({
      editedMessage: ['', Validators.required]
    })

    this.message.messageCreated$.subscribe((newMessage: any) => {
      this.messages.push(newMessage);
    });
  }


  onSendMessage() {
    this.sentMessage = this.sendForm.value.message;
    if (this.message.receiverId !== null && this.sentMessage !== '') {
      this.message.sendMessages(this.message.receiverId, this.sentMessage)
        .subscribe(response => {
          console.log('Message sent:', response);
          this.sendForm.reset();
        })
    }
  }

  openContextMenu(event: MouseEvent, clickedMessage: any) {
    event.preventDefault(); // Prevent default browser context menu
    if (clickedMessage.senderId == this.loggedInUserId) {
      this.contextMenuX = event.clientX;
      this.contextMenuY = event.clientY;
      this.contextMenuVisible = true;
      this.contextMenuMessage = clickedMessage;
    }

  }

  closeContextMenu() {
    this.contextMenuVisible = false;
  }

  // Close the context menu when clicking anywhere else on the page
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.contextMenuVisible) return;
    this.closeContextMenu();
  }

  onEditMessage() {
    if (this.contextMenuMessage !== null) {
      this.contextMenuMessage.isEditing = true;
    }
    this.closeContextMenu();
  }

  onSaveChanges() {
    if (this.contextMenuMessage !== null) {
      this.contextMenuMessage.content = this.editForm.value.editedMessage;
    }
  }

  onCancelChanges() {

  }

}
