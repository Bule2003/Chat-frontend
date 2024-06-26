import {Component, inject, Inject} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
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
  selector: 'delete-conversation-dialog',
  templateUrl: 'delete-conversation-dialog.component.html',
  styleUrl: 'delete-conversation-dialog.component.scss',
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
  ],
})
export class DeleteConversationDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteConversationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  #conversationService = inject(ConversationService);

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteConversation(id: number) {
    this.#conversationService.delete(id)
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
