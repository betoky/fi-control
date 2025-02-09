import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-chip',
  imports: [ButtonModule],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss'
})
export class ChipComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) color!: string;
  @Input({ required: true }) bg!: string;
  
  @Input() isLoading = false;
  @Input() deletable = false;

  @Output() delete = new EventEmitter<void>();
}
