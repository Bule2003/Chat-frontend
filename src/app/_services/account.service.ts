import { Injectable, Injector, inject } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, throwError} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import {AuthResponse} from "@app/_models/authResponse";

// TODO: optional->prompt the user to verify their email address

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
  public user = this.userSubject.asObservable();

  private tokenSubject: BehaviorSubject<string | null>;
  public token: Observable<string | null>;
  public isLoggedIn = false;


  constructor(private injector: Injector) {
    this.userSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
    this.tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('access_token'));
    this.token = this.tokenSubject.asObservable();
    this.isLoggedIn = !!this.tokenSubject.value;
  }

  public get userValue() {
    return this.userSubject.value;
  }

  public get tokenValue() {
    return this.tokenSubject.value;
  }

  #router = inject(Router);
  #http = inject(HttpClient);

  login(email: string | null, password: string | null) {
    return this.#http.post<AuthResponse>(`${environment.apiUrl}/login`, { email, password })
      .pipe(map(response => {
        localStorage.setItem('access_token', response.authorisation.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.tokenSubject.next(response.authorisation.token);
        this.userSubject.next(response.user);
        this.isLoggedIn = true;
        return response;
      }),
      catchError(error => {
        console.error('Error:', error);
        return throwError(error);
      }));
  }

  logout() {
    // remove token from local storage and set current token to null
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.tokenSubject.next(null);
    this.isLoggedIn = false;
    this.#router.navigateByUrl('/login');
  }

  register(first_name: string | null, last_name: string | null, username: string | null , email: string | null, password: string | null, password_confirmation: string | null) {
    return this.#http.post<AuthResponse>(`${environment.apiUrl}/register`, {first_name, last_name, username, email, password, password_confirmation})
      .pipe(map(response => {
        this.isLoggedIn = true;
        localStorage.setItem('access_token', response.authorisation.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.tokenSubject.next(response.authorisation.token);
        this.userSubject.next(response.user);
        return response;
      }),
      catchError(error => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  uploadUserImage(image: FormData){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    });

    return this.#http.post(`${environment.apiUrl}/uploadUserImage`, image, {headers})
      .pipe(map(response => {
        console.log(response);
      }),
      catchError(err => {
        console.error(err);
        return err;
      })
    );
  }
}
