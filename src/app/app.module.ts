import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {provideRouter, RouterLink} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {LoginComponent} from "@app/login/login.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from "@angular/common/http";
import {ROUTES} from "@app/app.routes";
import {JwtInterceptor} from "@app/jwt.interceptor";


@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterLink
  ],
  providers: [
    /*{
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }*/
  ],
})
export class AppModule {
  constructor() {
    console.log('Application loaded...');
  }
}
