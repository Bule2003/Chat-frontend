import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";import {fakeBackendProvider} from "@app/_helpers";
import {provideRouter, RouterLink} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {LoginComponent} from "@app/login/login.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule, HttpClient} from "@angular/common/http";
import {ROUTES} from "@app/app.routes";


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
    fakeBackendProvider,
  ],
})
export class AppModule { }
