import {Component, inject, OnInit} from '@angular/core';
import {FormsModule, Validators, FormGroup, FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {Post} from '../_models/post.model';
import {ToastrService} from 'ngx-toastr';
import {AccountService} from "@app/_services";
import {NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  file: any;
  submitted = false;
  /*form: FormGroup*/
  form: any;
  post = new Post();
  data: any;
  imagePreview: string | ArrayBuffer | null = null;

  constructor() {
  }

  /*#toastr = inject(ToastrService);*/
  #formBuilder = inject(FormBuilder);
  #accountService = inject(AccountService);

  loggedInUser = this.#accountService.userValue;

  ngOnInit() {
    this.createForm();
    console.log(this.loggedInUser);
  }

  createForm() {
    this.form = this.#formBuilder.group({
      image: ['', Validators.required]
    })
  }

  onFileChange(event: any) {
    if(event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.patchValue({
        image: file
      });
    }
  }

  get f() {return this.form.controls;}

  uploadImage(event: any) {
    this.file = event.target.files[0];
    console.log(this.file);
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid){
       return;
    }

    const formData = new FormData();
    formData.append("image", this.file, this.file.name);

    console.log(formData);

    this.#accountService.uploadUserImage(formData).subscribe({
      next: (response) => {
        console.log('Image uploaded successfully:', response);
      },
      error: (error) => {
        console.error('Error uploading images:', error);
      }
    })
  }

  uploadUserImage(event: Event){
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({ image:file });
    this.form.get('image')!.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
        this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);
  }
}
