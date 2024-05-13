import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';

import {FormComponent} from "@app/input/form.component";
import {ButtonComponent} from "@app/ui/button/button.component";
import { AccountService } from '@app/_services'
import {CommonModule, NgClass, NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";


@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    NgClass,
    FormComponent,
    ButtonComponent
  ],
  templateUrl: 'login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

}
