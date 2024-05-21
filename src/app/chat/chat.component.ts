import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "@app/_services/message.service";
import {MatButtonModule} from "@angular/material/button";
import {ConversationService} from "@app/_services/conversation.service";
import {NgForOf, NgIf} from "@angular/common";
import {MatListModule} from "@angular/material/list";
import {MatDividerModule} from "@angular/material/divider";


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatButtonModule,
    NgIf,
    NgForOf,
    MatDividerModule,
    MatListModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit{
  title = 'Chat';
  conversations: any[] = [];

  #conversationService = inject(ConversationService);

  ngOnInit() {
    this.loadConversations();
  }

  loadConversations() {
    return this.#conversationService.getConversations().subscribe(
      (data) => {
        this.conversations = data;
      },
      (error) => {
        console.error('Error fetching conversations', error);
      }
    )
  }

  onClick () {
    // TODO: open up search where the user can find another user he wants to chat to
    console.log('Clicked');
  }
}
