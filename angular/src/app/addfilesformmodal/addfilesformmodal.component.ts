import { Component, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-addfilesformmodal',
  standalone: true,
  imports: [],
  templateUrl: './addfilesformmodal.component.html',
})
export class AddfilesformmodalComponent {
  @Output() toggleAddFilesComponent = new EventEmitter<void>();

  toggleAddFiles() {
    this.toggleAddFilesComponent.emit();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.relative');

    if (!clickedInside) {
      this.toggleAddFiles()
    }
  }
}
