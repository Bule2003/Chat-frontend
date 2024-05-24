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
import {MatCard, MatCardContent} from "@angular/material/card";
import {BehaviorSubject} from "rxjs";
import {MatIcon} from "@angular/material/icon";


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
    MatInput,
    MatCard,
    MatCardContent,
    MatIcon
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
  messageForm!: FormGroup;
  conversationForm!: FormGroup;
  message: string = '';
  user: any;
  showPopup = false;

  @ViewChild('scrollableDiv', { static: false}) scrollableDiv: ElementRef | undefined;

  private errorMessageSubject = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(private formBuilder: FormBuilder) {
    this.user = this.#accountService.userValue;
  }


  ngOnInit() {
    this.messageForm = this.formBuilder.group({
      content: ['', Validators.required]
    })
    this.conversationForm = this.formBuilder.group({
      title: ['', Validators.required],
      recipient_user: ['', Validators.required]
    })
    this.loadConversations();
  }

  #route = inject(ActivatedRoute);
  #router = inject(Router);
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
    this.showPopup = true;
  }

  closePopup () {
    this.showPopup = false;
  }

  get cf() { return this.conversationForm.controls; }

  startConversation() {
    this.#conversationService.create(this.cf.title.value, this.cf.recipient_user.value)
      .pipe(first())
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message='';
          this.errorMessageSubject.next(null);
          this.closePopup();
          /*window.location.reload();*/
        },
        error: error => {
          this.message = error.error.message;
          this.errorMessageSubject.next(this.message);
          /*this.error = error;*/
          // @ts-ignore
          console.log(this.errorMessage$?.source?.value);
          /*console.log('Error', error.error.message);*/
        }
      })
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
    const recipient_username = (sender_username ===  this.selectedConversation.users[0].username) ? this.selectedConversation.users[1].username : this.selectedConversation.users[0].username;

    console.log('The id of the conversation: ', this.selectedConversation.id);
    console.log('The sender of the message is: ', sender_username);
    console.log('The recipient of the message is: ', recipient_username);
    console.log('The content of the message is: ', this.f.content.value);

    if (this.messageForm.invalid) {
      return;
    }

    this.#messageService.SendMessage(this.selectedConversation.id, sender_username, recipient_username, this.f.content.value)
      .pipe(first())
      .subscribe({
        next: () => {
          window.location.reload();
        },
        error: error => {
          this.message = error.error.message;
          console.error('The error is:', this.message);
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
