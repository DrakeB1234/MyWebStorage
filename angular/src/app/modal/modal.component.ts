import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit {
  isVisible: boolean = false;
  contentTemplate: any = null;
  title?: string = "";
  message?: string = "";

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    // Subscribe to modal visibility and template changes
    this.modalService.isVisible$.subscribe((isVisible) => {
      this.isVisible = isVisible;
    });

    this.modalService.modalContent$.subscribe((data) => {
      this.title = data?.title;
      this.message = data?.message;
      this.contentTemplate = data?.contentTemplate;
    });
  }

  close(): void {
    this.modalService.close();
  }
}
