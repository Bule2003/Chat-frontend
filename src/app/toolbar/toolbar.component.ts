import {Component, inject, Input, OnInit} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NgForm, ReactiveFormsModule} from "@angular/forms";
import {AccountService} from "@app/_services";
import {CommonModule} from "@angular/common";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ReactiveFormsModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent{
  @Input() title: string | undefined;

  constructor(
  ) { }

  #router = inject(Router);
  public accountService = inject(AccountService);

  onNavigate(url: string) {
    this.#router.navigateByUrl(url);
  }

  handleLogout() {
    this.accountService.logout();
  }
}
