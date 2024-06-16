import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from "./chat/chat.component";
import {HomeComponent} from "./home/home.component";
import {FeaturesComponent} from "./features/features.component";
import {AboutUsComponent} from "@app/chat/about-us/about-us.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "@app/register/register.component";
import {PagenotfoundComponent} from "@app/pagenotfound/pagenotfound.component";
import {ProfileComponent} from "@app/profile/profile.component";

export const ROUTES: Routes = [
  {path: '', component: HomeComponent, data: { title: 'Chatify' }},
  {path: 'chat', component: ChatComponent, data: { title: 'Chat' }},
  {path: 'profile', component: ProfileComponent, data: { title: 'Profile' }},
  {path: 'features', component: FeaturesComponent, data: { title: 'Features' }},
  {path: 'about-us', component: AboutUsComponent, data: { title: 'About Us' }},
  {path: 'login', component: LoginComponent, data: { title: 'Login' }},
  {path: 'register', component: RegisterComponent, data: { title: 'Register' }},
  {path: '**', pathMatch: 'full', component: PagenotfoundComponent},
];
