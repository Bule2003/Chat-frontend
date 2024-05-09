import { Routes } from '@angular/router';
import {ChatComponent} from "./chat/chat.component";
import {AppComponent} from "./app.component";
import {HomeComponent} from "./home/home.component";

export const ROUTES: Routes = [
  {path: '', component: HomeComponent, data: { title: 'Home' }},
  {path: 'chat', component: ChatComponent, data: { title: 'Chat' }},
  {path: 'features', component: ChatComponent, data: { title: 'Features' }}, // TODO: add components
  {path: 'about-us', component: ChatComponent, data: { title: 'About Us' }},
  {path: 'sign-in', component: ChatComponent, data: { title: 'Sign In' }}
];
