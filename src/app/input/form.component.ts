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
import {Location} from '@angular/common';

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
  message: any = '';
  /*isLoggedIn: boolean = false;*/
  token = localStorage.getItem('access_token');
  matcher = new MyErrorStateMatcher();

  form!: FormGroup;
  loading = false;
  submitted = false;
  error?: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private _location: Location,
  ) {

    if (this.accountService.userValue) {
      console.log('User already logged in ', this.accountService.userValue);
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: new FormControl('',[
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl<string>('', {
        /*validators: [Validators.required, Validators.pattern('/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d).{8,}$/')],*/
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

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
          if (data) {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigateByUrl(returnUrl);
          } else {
            this.form.setErrors({unauthenticated: true});
          }

        },
        error: error => {
          this.message = error.error.message;
          this.error = error;
          this.loading = false;
        }
      });
  }
}
