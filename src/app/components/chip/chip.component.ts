import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chip',
  imports: [],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss'
})
export class ChipComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) color!: string;
  @Input({ required: true }) bg!: string;
}
