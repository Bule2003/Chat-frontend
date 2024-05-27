import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConversationDialogComponent } from './update-conversation-dialog.component';

describe('UpdateConversationDialogComponent', () => {
  let component: UpdateConversationDialogComponent;
  let fixture: ComponentFixture<UpdateConversationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateConversationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateConversationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
