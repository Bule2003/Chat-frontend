import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConversationDialogComponent } from './delete-conversation-dialog.component';

describe('DeleteConversationDialogComponent', () => {
  let component: DeleteConversationDialogComponent;
  let fixture: ComponentFixture<DeleteConversationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConversationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteConversationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
