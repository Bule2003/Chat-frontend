import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";
import {Message} from "@app/_models/message";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/messages`;

  constructor() { }

  #http = inject(HttpClient);



  SendMessage(conversation_id: number, sender_username: string, recipient_username: string, content: string) {
    return this.#http.post<Message>(`${environment.apiUrl}/SendMessage`, { conversation_id, sender_username, recipient_username, content })
      .pipe(map(response => {
        console.log(response);
        return response;
      }),
        // @ts-ignore
      catchError(error => {
        console.error('Error', error);
        return throwError;
      }));
  }

  getMessages(conversationId: number): Observable<any> {
    return this.#http.get<any>(`${this.apiUrl}/${conversationId}`);
  }
  // TODO: loading messages
}
