import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmdialog',
  standalone: true,
  imports: [],
  templateUrl: './confirmdialog.component.html',
})
export class ConfirmdialogComponent {
  @Input() dialogMessage!: string;
  @Output() callback = new EventEmitter<void>();
  @Output() closeConfirmDialog = new EventEmitter<void>();

  handleRes(res: boolean) {
    if (res) {
      this.callback.emit();
    } 
    this.closeConfirmDialog.emit();
  }
}
