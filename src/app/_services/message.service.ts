import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";
import {Message} from "@app/_models/message";
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  #http = inject(HttpClient);

  sendMessage(sender_username: string, recipient_username: string, content: string) {
    return this.#http.post<Message>(`${environment.apiUrl}/login`, { sender_username, recipient_username, content })
      .pipe(map(response => {
        return response;
      }),
        // @ts-ignore
      catchError(error => {
        console.error('Error', error);
        return throwError;
      }));
  }

  // TODO: loading messages
}
