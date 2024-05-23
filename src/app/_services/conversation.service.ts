import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private apiUrl = `${environment.apiUrl}/conversations`;

  constructor() { }

  #http = inject(HttpClient);

  getConversations(page: number = 1): Observable<any> {
    return this.#http.get<any>(`${this.apiUrl}?page=${page}`);
  }
}
