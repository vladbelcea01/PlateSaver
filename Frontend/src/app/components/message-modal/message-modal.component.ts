import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrl: './message-modal.component.css'
})
export class MessageModalComponent implements OnInit {
  @Input() message: string = '';
  @Output() modalClose = new EventEmitter<boolean>();
  constructor(){ }

  ngOnInit(): void {    
  }

  modalCloseClicked(){
    this.modalClose.emit(true);
  }
}
