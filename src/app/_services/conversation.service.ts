import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, pipe, throwError} from "rxjs";
import {environment} from "@environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private apiUrl = `${environment.apiUrl}/conversations`;

  constructor() { }

  #http = inject(HttpClient);

  create(title: string, recipient_username: string){
    return this.#http.post<any>(`${this.apiUrl}`, { title, recipient_username })
      .pipe(map(response => {
        return response;
      }));
  }

  update(id: number, title: string) {
    return this.#http.put(`${this.apiUrl}/${id}`, { title })
      .pipe(map(response => {
        return response;
      }))
  }

  delete(id: number) {
    return  this.#http.delete(`${this.apiUrl}/${id}`)
      .pipe(map(response => {
        return response;
    }))
  }

  getConversations(page: number = 1): Observable<any> {
    return this.#http.get<any>(`${this.apiUrl}?page=${page}`);
  }
}
