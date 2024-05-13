import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from "./chat/chat.component";
import {HomeComponent} from "./home/home.component";
import {FeaturesComponent} from "./features/features.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "@app/register/register.component";

export const ROUTES: Routes = [
  {path: '', component: HomeComponent, data: { title: 'Home' }},
  {path: 'chat', component: ChatComponent, data: { title: 'Chat' }},
  {path: 'features', component: FeaturesComponent, data: { title: 'Features' }}, // TODO: add components
  {path: 'about-us', component: AboutUsComponent, data: { title: 'About Us' }},
  {path: 'login', component: LoginComponent, data: { title: 'Login' }},
  {path: 'register', component: RegisterComponent, data: { title: 'Register' }}
];
