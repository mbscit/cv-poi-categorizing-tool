import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Mode} from "../app/image-view/mode";

@Component({
  selector: 'app-mode-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mode-selection.component.html',
  styleUrl: './mode-selection.component.css'
})
export class ModeSelectionComponent {
  modes = Mode;
  selectedMode: Mode = Mode.FLIP;

  @Output() modeSelected = new EventEmitter<Mode>();

  selectMode(mode: Mode) {
    this.selectedMode = mode;
    this.modeSelected.emit(mode);
  }

  getModeKeys(): Mode[] {
    return Object.values(this.modes).filter(value => typeof value === 'number') as Mode[];
  }

}
