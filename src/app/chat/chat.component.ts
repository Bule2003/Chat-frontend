import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "@app/_services/message.service";
import {MatButtonModule} from "@angular/material/button";
import {ConversationService} from "@app/_services/conversation.service";
import {NgForOf, NgIf} from "@angular/common";
import {MatListModule} from "@angular/material/list";
import {MatDividerModule} from "@angular/material/divider";
/*import {MatFormField, MatInput, MatLabel} from "@angular/material/input";*/
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {first} from "rxjs/operators";
import {AccountService} from "@app/_services";


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatButtonModule,
    NgIf,
    NgForOf,
    MatDividerModule,
    MatListModule,
    /*MatInput,*/
    MatLabel,
    MatFormField,
    FormsModule,
    ReactiveFormsModule,
    MatError,
    MatHint,
    MatInput
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit{
  title = 'Chat';
  conversations: any[] = [];
  messages: any[] = [];
  sender_username: string = '';
  recipient_username: string = '';
  currentPage = 1;
  loading = false;
  loadingMessages = false;
  hasMoreConversations = true;
  selectedConversation: any;
  error?: string;

  // TODO: fix sender and recipient username issue

  messageForm!: FormGroup;

  @ViewChild('scrollableDiv', { static: false}) scrollableDiv: ElementRef | undefined;

  constructor(private formBuilder: FormBuilder) {
  }

  #route = inject(ActivatedRoute);
  #router = inject(Router);


  ngOnInit() {
    this.messageForm = this.formBuilder.group({
      content: ['', Validators.required]
    })
    this.loadConversations();
  }

  #accountService = inject(AccountService);
  #conversationService = inject(ConversationService);
  #messageService = inject(MessageService);

  loadConversations() {
    if(this.loading || !this.hasMoreConversations) {
      return;
    }

    this.loading = true;

    this.#conversationService.getConversations(this.currentPage).subscribe(
      (data) => {
        this.conversations = [...this.conversations, ...data.data];
        this.sender_username = data.data[0].messages[0].sender_username;
        this.recipient_username = data.data[0].messages[0].recipient_username;
        this.hasMoreConversations = data.next_page_url != null;
        this.loading = false;
        this.currentPage++;
      },
      (error) => {
        this.loading = false;
        console.error('Error fetching conversations', error);
      }
    )
  }

  onScroll(): void {
    const nativeElement = this.scrollableDiv?.nativeElement;
    const bottom = nativeElement.scrollHeight - nativeElement.scrollTop === nativeElement.clientHeight;
    if (bottom) {
      console.log('Reached bottom of the container');
      this.loadConversations();
    }
  }

  onClick () {
    // TODO: open up search where the user can find another user he wants to chat to
    console.log('Clicked');
  }

  selectConversation(conversation: any): void {
    this.selectedConversation = conversation;
  }

  get f() { return this.messageForm.controls; }

  sendMessage() {
    const loggedInUser = this.#accountService.userValue;
    if (!loggedInUser) {
      this.error = 'User not logged in';
      return;
    }
    const sender_username = loggedInUser.username;

    let recipient_username = '';
    const lastMessage = this.selectedConversation.messages[this.selectedConversation.messages.length - 1];
    if (this.selectedConversation && this.selectedConversation.messages.length > 0) {
      console.log(lastMessage);
      recipient_username = lastMessage.sender_username === sender_username
        ? lastMessage.recipient_username
        : lastMessage.sender_username;
    }

    console.log('The id of the conversation: ', lastMessage.conversation_id);
    console.log('The sender of the message is: ', sender_username);
    console.log('The recipient of the message is: ', recipient_username);
    console.log('The content of the message is: ', this.f.content.value);

    if (this.messageForm.invalid) {
      return;
    }


    this.#messageService.SendMessage(lastMessage.conversation_id, sender_username, recipient_username, this.f.content.value)
      .pipe(first())
      .subscribe({
        next: (message) => {
          window.location.reload();
        },
        error: error => {
          this.error = error;
        }
      })
  }

  /*loadMessages(conversationId: number): void{
    this.loadingMessages = true;
    this.selectedConversation = this.conversations.find(c => c.id === conversationId);

    this.#messageService.getMessages(conversationId).subscribe(data => {
      this.messages = data;
      this.loadingMessages = false;
    }, (error: any) => {
      console.error('Error loading messages:', error);
      this.loadingMessages = false;
    });
  }*/
}
