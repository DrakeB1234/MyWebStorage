import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

interface Modal {
  title: string,
  contentTemplate: TemplateRef<any> | null,
  message?: string
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isVisibleSubject = new BehaviorSubject<boolean>(false);
  public isVisible$ = this.isVisibleSubject.asObservable();
  private modalContentSubject = new BehaviorSubject<Modal | null>(null);
  public modalContent$ = this.modalContentSubject.asObservable();

  constructor() {}

  open(modalOptions: Modal) {
    this.modalContentSubject.next(modalOptions); // Set template reference as content
    this.isVisibleSubject.next(true); // Show modal
  }

  close() {
    this.isVisibleSubject.next(false); // Hide modal
  }
}
