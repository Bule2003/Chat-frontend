import {Component, ElementRef, Inject, inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "@app/_services/message.service";
import {MatButtonModule} from "@angular/material/button";
import {ConversationService} from "@app/_services/conversation.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatListModule} from "@angular/material/list";
import {MatDividerModule} from "@angular/material/divider";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatFormFieldModule, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {first} from "rxjs/operators";
import {AccountService} from "@app/_services";
import {MatCard, MatCardContent} from "@angular/material/card";
import {BehaviorSubject} from "rxjs";
import {MatIcon} from "@angular/material/icon";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {DeleteConversationDialog} from "@app/delete-conversation-dialog/delete-conversation-dialog.component";
import {UpdateConversationDialog} from "@app/update-conversation-dialog/update-conversation-dialog.component";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {EchoService} from "@app/_services/echo.service";

export interface DialogData {
  selectedConversation: any;
}

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
    MatIcon,
    NgxSkeletonLoaderModule,
    NgClass
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

  @ViewChild('scrollableDiv', { static: false}) scrollableDiv?: ElementRef;

  private errorMessageSubject = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {
    this.user = this.#accountService.userValue;
  }

  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #accountService = inject(AccountService);
  #conversationService = inject(ConversationService);
  #messageService = inject(MessageService);
  #echoService = inject(EchoService);

  ngOnInit() {
    if (!this.#accountService.userValue) {
      this.#router.navigate(['/login']);
    }

    this.messageForm = this.formBuilder.group({
      content: ['', Validators.required]
    })
    this.conversationForm = this.formBuilder.group({
      title: ['', Validators.required],
      recipient_user: ['', Validators.required]
    })

    this.loadConversations();

    /*this.#route.params.subscribe(params => {
      const conversationId = params['id'];
      if (conversationId) {
        this.selectConversation(conversationId);
      }
    })*/
  }

  subscribeToConversation(conversationId: number) {
    console.log(`Subscribing to conversation ${conversationId}`);
    this.#echoService.listen(`chat.${conversationId}`, '.MessageSent', (data: any) => {
      console.log('Message received', data);
      this.messages.push(data.message);
      this.scrollToBottom();
    })
  }

  // TODO: move more request logic to services

  loadConversations() {
    if(this.loading || !this.hasMoreConversations) {
      return;
    }

    this.loading = true;

    this.#conversationService.getConversations().subscribe(
      data => {
        this.loading = false;
        this.conversations = data.data;
      },
      error => {
        console.error('Error fetching conversations', error);
      }
    )

    /*this.#conversationService.getConversations(this.currentPage).subscribe(
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
    )*/
  }

  openUpdateDialog(): void {
    const dialogRef = this.dialog.open(UpdateConversationDialog, {
      data: {selectedConversation: this.selectedConversation},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    })
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteConversationDialog, {
      data: {selectedConversation: this.selectedConversation},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    })
  }

  onScroll(): void {
    const nativeElement = this.scrollableDiv?.nativeElement;
    const bottom = nativeElement.scrollHeight - nativeElement.scrollTop === nativeElement.clientHeight;
    if (bottom) {
      console.log('Reached bottom of the container');
      this.loadConversations();
    }
    /*const threshold: number = 150;
    const position = this.scrollableDiv?.nativeElement.scrollTop + this.scrollableDiv?.nativeElement.clientHeight;
    const height = this.scrollableDiv?.nativeElement.scrollHeight;

    if (height - position < threshold) {
      if (this.selectedConversation) {
        this.loadMoreMessages();
      } else {
        this.loadMoreConversations();
      }
    }*/
  }

  /*loadMoreConversations() {
    if (this.loading) return;
    this.loading = true;

    this.#conversationService.loadMoreConversations.subscribe(newConversations => {
      this.conversations.push(...newConversations);
      this.loading = false;
    })
  }

  loadMoreMessages() {
    if (this.loadingMessages) return;
    this.loadingMessages = true;

    this.#messageService.loadMoreMessages(this.selectedConversation.id).subscribe(newMessages => {
      this.selectedConversation.messages.push(...newMessages);
      this.loadingMessages = false;
    })
  }*/

  onClick() {
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
        },
        error: error => {
          this.message = error.error.message;
          this.errorMessageSubject.next(this.message);
          // @ts-ignore
          /*console.log(this.errorMessage$?.source?.value);*/
        }
      })
  }

  selectConversation(conversation: any): void {
    this.selectedConversation = conversation;
    this.messages = conversation.messages || [];
    this.subscribeToConversation(conversation.id);
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

    if (this.messageForm.invalid) {
      return;
    }

    this.#messageService.SendMessage(this.selectedConversation.id, sender_username, recipient_username, this.f.content.value)
      .pipe(first())
      .subscribe({
        next: (res) => {
          /*this.messageForm.reset();*/
            /*this.scrollToBottom();*/
        },
        error: error => {
          this.message = error.error.message;
          console.error('The error is:', this.message);
          this.error = error;
        }
      })
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.scrollableDiv) {
        this.scrollableDiv.nativeElement.scrollTop = this.scrollableDiv.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
// change detection
