import { Injectable, Injector, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, throwError} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
  public user = this.userSubject.asObservable();
  public isLoggedIn = false;

  constructor(private injector: Injector) {
    /*this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();*/
  }

  public get userValue() {
    return this.userSubject.value;
  }

  #router = inject(Router);
  #http = inject(HttpClient);

  login(email: string | null, password: string | null) {
    return this.#http.post<User>(`${environment.apiUrl}/login`, { email, password })
      .pipe(map(user => {
        console.log('Logged in User', user);
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }),
      catchError(error => {
        console.error('Error:', error);
        return throwError(error);
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    this.isLoggedIn = false;
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.#router.navigate(['/login']);
  }
}
