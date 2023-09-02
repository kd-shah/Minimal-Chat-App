import { Component, HostListener, NgModule, OnInit } from '@angular/core';
import { MessageService } from 'src/app/Services/message.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs';


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


  messages!: Message[];
  messagesFound = true;

  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuMessage: Message | null = null;

  sendForm!: FormGroup
  sentMessage: any;

  editForm!: FormGroup;


  loggedInUserId = this.auth.getUserId();

  private beforeTimestamp: string | null = null;
  private isLoading = false;
  private isEndOfMessages = false;

  constructor(private route: ActivatedRoute,
    private message: MessageService,
    private auth: AuthService,
    private fb: FormBuilder) { }


  ngOnInit() {
    this.route.params.subscribe(params => {
      const userId = +params['userId'];
      this.message.receiverId = userId;

      this.loadMessages();
      // this.message.getMessages(userId).subscribe((response: any[]) => {
      //   this.messages = response.map((msg: Message) => ({
      //     ...msg,
      //     isEditing: false,
      //   }))
      //   this.messagesFound = this.messages.length > 0;
      // }
      // );
    });


    this.sendForm = this.fb.group({
      message: ['', Validators.required]
    })

    this.editForm = this.fb.group({
      editedMessage: ['', Validators.required]
    })

    // this.message.messageCreated$.subscribe((newMessage: any) => {
    //   console.log('New message received:', newMessage);
    //   this.messages.push(newMessage);
    // });
  }


  onSendMessage() {
    this.sentMessage = this.sendForm.value.message;
    if (this.message.receiverId !== null && this.sentMessage !== '') {
      const receiverId = this.message.receiverId;
      this.messagesFound = true;
      this.message.sendMessages(receiverId, this.sentMessage)
        .pipe(
          switchMap(() => this.message.getMessages(receiverId))
        )
        .subscribe((response: any[]) => {
          this.sendForm.reset();
          this.messages = response.map((msg: Message) => ({
            ...msg,
            isEditing: false,
          })).reverse();
        }
        );


    }
  }


  //Loading Initial Messages
  loadMessages() {
    console.log('Loading initial messages...');
    console.log('Receiver ID:', this.message.receiverId);
    console.log('Before Timestamp:', this.beforeTimestamp);

    if (this.message.receiverId != null) {
      this.message.getMessages(this.message.receiverId, this.beforeTimestamp)
        .subscribe((response: any[]) => {
          this.messages = response.map((msg: Message) => ({
            ...msg,
            isEditing: false,
          })).reverse();
          this.messagesFound = this.messages.length > 0;

          setTimeout(() => {
            this.scrollToBottom();
          });

          // Set the `beforeTimestamp` to the timestamp of the last message
          if (this.messages.length > 0) {
            this.beforeTimestamp = this.messages[0].timestamp;
          }
        });
    }
  }

  scrollToBottom() {
    const messageContainer = document.querySelector('.user-chat');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }

  // Load More Messages
  loadMoreMessages() {
    if (!this.isLoading && !this.isEndOfMessages && this.message.receiverId != null && this.beforeTimestamp != null) {
      this.isLoading = true;
      const receiverId = this.message.receiverId;

      this.message.getMessages(receiverId, this.beforeTimestamp).subscribe((response: any[]) => {
        const olderMessages = response.map((msg: Message) => ({
          ...msg,
          isEditing: false,
        })).reverse();

        if (olderMessages.length > 0) {
          this.messages = [...olderMessages, ...this.messages];
          this.beforeTimestamp = olderMessages[0].timestamp;
          
        } else {
          
          this.isEndOfMessages = true;
        }

        this.isLoading = false;
      });
    }
  }

  // Scrolling
  @HostListener('scroll', ['$event.target'])
  onScroll(userChat: HTMLElement) {
    if (userChat.scrollTop === 0) {
      this.loadMoreMessages();
      console.log("the end")
    }
  }



  openContextMenu(event: MouseEvent, clickedMessage: any) {
    event.preventDefault();
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
      this.editForm.patchValue({ editedMessage: this.contextMenuMessage.content });
    }
    this.closeContextMenu();
  }

  onSaveChanges() {
    if (this.contextMenuMessage !== null && this.contextMenuMessage.id !== null) {
      const receiverId = this.message.receiverId;
      if (receiverId !== null) {
        this.message.editMessage(this.contextMenuMessage.id, this.editForm.value.editedMessage)
          .subscribe(response => {
            console.log('Message edited:', response);
            this.editForm.reset();
            this.message.getMessages(receiverId).subscribe((response: any[]) => {
              this.messages = response.map((msg: Message) => ({
                ...msg,
                isEditing: false,
              })).reverse()

            }
            );

          })
      }
    }
    else {
      console.log("Erros found");
    }
  }

  onCancelChanges() {
    if (this.contextMenuMessage !== null) {
      this.contextMenuMessage.isEditing = false;
    }
    this.closeContextMenu();
  }

  onDeleteMessage() {
    if (this.contextMenuMessage !== null) {
      const receiverId = this.message.receiverId;
      if (receiverId !== null) {
        this.message.deleteMessage(this.contextMenuMessage.id).subscribe(response => {
          console.log(response);
          this.message.getMessages(receiverId).subscribe((response: any[]) => {
            this.messages = response.map((msg: Message) => ({
              ...msg,
              isEditing: false,
            })).reverse()
            this.messagesFound = this.messages.length > 0;
          }
          );
        })
      }
    }
  }

}
