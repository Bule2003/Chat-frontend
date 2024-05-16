import {Component, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule, FormGroup, FormBuilder,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ButtonComponent} from "@app/ui/button/button.component";
import {MatButton} from "@angular/material/button";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AccountService} from "@app/_services";
import {first} from "rxjs/operators";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

/** @title Input with a custom ErrorStateMatcher */
@Component({
  selector: 'form-component',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ButtonComponent,
    MatButton,
    RouterLink,
    RouterLinkActive
  ],
})
export class FormComponent implements OnInit {
  data: any;
  isLoggedIn: boolean = false;

  matcher = new MyErrorStateMatcher();

  form!: FormGroup;
  loading = false;
  submitted = false;
  error?: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {
    // redirect to home if already logged in
    /*$this.isLoggedIn = true;*/
    if (this.accountService.userValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  /*checkByCredential(email: string, password: string)
  {
    this.accountService.checkByCredential(email, password)
      .subscribe((users: any) => {
        if(users)
          this.router.navigateByUrl('/');
        else
          this.isLoggedIn = false;
          return false
      });
  }*/

  onSubmit() {
    console.log(this.form.value);
    this.submitted = true;

    // reset alert on submit
    this.error = '';

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: (data) => {
          // get return url from query parameters or default to home page
          if (data) {
            this.accountService.isLoggedIn = true;
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigateByUrl(returnUrl);
          } else {
            this.form.setErrors({unauthenticated: true});
          }

        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }
}
