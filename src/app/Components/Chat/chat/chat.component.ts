import { Component, HostListener, OnInit } from '@angular/core';
import { MessageService } from 'src/app/Services/message.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs';
import { Message, MessageResponse } from './model';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {


  messages!: Message[];
  messagesFound!: boolean;

  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuMessage: Message | null = null;

  sendForm!: FormGroup
  sentMessage!: string;

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

      console.log('ngOnInit called with userId:', userId);
      this.messagesFound = true;
      this.loadMessages();
    });


    this.sendForm = this.fb.group({
      message: ['', Validators.required]
    })

    this.editForm = this.fb.group({
      editedMessage: ['', Validators.required]
    })

  }

  //Loading Initial Messages
  loadMessages() {
    if (this.message.receiverId != null) {
      this.messagesFound = true;
      this.message.getMessages(this.message.receiverId)
        .subscribe((response: MessageResponse[]) => {
          this.messages = response.map((msg: MessageResponse) => ({
            ...msg,
            isEditing: false,
          })).reverse();
          this.messagesFound = this.messages.length > 0;

          setTimeout(() => {
            this.scrollToBottom();
          });

          console.log('messagesFound:', this.messagesFound);


        }, (error) => {
          console.error('Error fetching messages:', error);
        }
        );
    }

  }

  //Auto scrolling to last message
  scrollToBottom() {
    const messageContainer = document.querySelector('.user-chat');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }




  // Load More Messages

  loadMoreMessages() {
    if (!this.isLoading || !this.isEndOfMessages && this.message.receiverId != null) {
      this.isLoading = true;
      const receiverId = this.message.receiverId;

      console.log(this.messages)

      // Scroll to junction
      const scrollContainer = document.querySelector('.user-chat');
      const scrollOffset = scrollContainer ? scrollContainer.scrollHeight - scrollContainer.scrollTop : 0;

      this.beforeTimestamp = this.messages[0].timestamp;
      console.log(this.beforeTimestamp)


      this.message.getMessages(receiverId, this.beforeTimestamp).subscribe((response: MessageResponse[]) => {
        console.log(this.beforeTimestamp);
        const olderMessages = response.map((msg: MessageResponse) => ({
          ...msg,
          isEditing: false,
        })).reverse();

        if (olderMessages.length > 0) {
          this.messages = [...olderMessages, ...this.messages];
          // this.beforeTimestamp = olderMessages[0].timestamp;
          this.beforeTimestamp = ''
          if (scrollContainer) {
            setTimeout(() => {
              scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollOffset;
            });
          }

        

        } else {

          this.isEndOfMessages = true;
        }

        this.isLoading = false;
      });
    }
  }

  //User scrolls on top
  @HostListener('scroll', ['$event.target'])
  onScroll(userChat: HTMLElement) {
    console.log(typeof userChat.scrollTop, 'Scroll event triggered');

    if (userChat.scrollTop === 0) {
      console.log('Scroll to the top');
      this.loadMoreMessages();
    }
  }

  //Sending a message
  onSendMessage() {
    this.sentMessage = this.sendForm.value.message;
    if (this.message.receiverId !== null && this.sentMessage !== '') {
      const receiverId = this.message.receiverId;
      this.messagesFound = true;
      this.message.sendMessages(receiverId, this.sentMessage)
        .pipe(
          switchMap(() => this.message.getMessages(receiverId))
        )
        .subscribe((response: MessageResponse[]) => {
          this.sendForm.reset();
          this.messages = response.map((msg: MessageResponse) => ({
            ...msg,
            isEditing: false,
          })).reverse();
        }
        );
        setTimeout(() => {
          this.scrollToBottom();
        });

    }
  }

  // Opening context menu
  openContextMenu(event: MouseEvent, clickedMessage: Message) {
    event.preventDefault();
    if (clickedMessage.senderId == this.loggedInUserId) {
      this.contextMenuX = event.clientX;
      this.contextMenuY = event.clientY;
      this.contextMenuVisible = true;
      this.contextMenuMessage = clickedMessage;
    }

  }

  //Closing context menu
  closeContextMenu() {
    this.contextMenuVisible = false;
  }

  // Close the context menu when clicking anywhere else on the page
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.contextMenuVisible) return;
    this.closeContextMenu();
  }

  //Editing a message
  onEditMessage() {
    if (this.contextMenuMessage !== null) {
      this.contextMenuMessage.isEditing = true;
      this.editForm.patchValue({ editedMessage: this.contextMenuMessage.content });
    }
    this.closeContextMenu();
  }

  //Save Edited Message
  onSaveChanges() {
    if (this.contextMenuMessage !== null && this.contextMenuMessage.id !== null) {
      const receiverId = this.message.receiverId;
      if (receiverId !== null) {
        this.message.editMessage(this.contextMenuMessage.id, this.editForm.value.editedMessage)
          .subscribe(response => {
            console.log('Message edited:', response);
            this.editForm.reset();
            this.message.getMessages(receiverId).subscribe((response: MessageResponse[]) => {
              this.messages = response.map((msg: MessageResponse) => ({
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

  // Cancel editing message
  onCancelChanges() {
    if (this.contextMenuMessage !== null) {
      this.contextMenuMessage.isEditing = false;
    }
    this.closeContextMenu();
  }

  // Deleting message
  onDeleteMessage() {
    if (this.contextMenuMessage !== null) {
      const receiverId = this.message.receiverId;
      if (receiverId !== null) {
        this.message.deleteMessage(this.contextMenuMessage.id).subscribe(response => {
          console.log(response);
          this.message.getMessages(receiverId).subscribe((response: MessageResponse[]) => {
            this.messages = response.map((msg: MessageResponse) => ({
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
