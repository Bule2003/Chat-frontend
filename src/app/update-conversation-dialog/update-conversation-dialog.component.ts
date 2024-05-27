import {Component, inject, Inject} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {ConversationService} from "@app/_services/conversation.service";
import {first} from "rxjs/operators";
import {DialogData} from "@app/chat/chat.component";

@Component({
  /*changeDetection: Chan*/
  selector: 'update-conversation-dialog',
  templateUrl: 'update-conversation-dialog.component.html',
  styleUrl: 'update-conversation-dialog.component.scss',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
  ],
})
export class UpdateConversationDialog {
  /*matcher = new MyErrorStateMatcher();*/
  updateForm!: FormGroup;
  submitted = false;
  error?: string;


  constructor(
    public dialogRef: MatDialogRef<UpdateConversationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(){
    this.updateForm = this.formBuilder.group({
      title: ['', Validators.required]
    })
  }
  #conversationService = inject(ConversationService);

  get f() { return this.updateForm.controls; }

  onNoClick(): void {
    this.dialogRef.close();
  }



  updateConversation(id: number) {
    console.log(this.updateForm.value);
    this.submitted = true;

    // reset alert on submit
    this.error = '';

    // stop here if form is invalid
    if (this.updateForm.invalid) {
      return;
    }

    this.#conversationService.update(id, this.f.title.value)
      .pipe(first())
      .subscribe({
        next: (res) => {
          console.log(res);
          window.location.reload();
        },
        error: (error) => {
          console.error(error);
        }
      })
  }
}
