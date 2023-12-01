import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Point} from "../point";
import {Status} from "../status";
import {fromEvent} from "rxjs";
import {Mode} from "./mode";

@Component({
  selector: 'app-image-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-view.component.html',
  styleUrl: './image-view.component.css'
})
export class ImageViewComponent implements OnInit {
  @Input() imageSrc: string | ArrayBuffer = '';
  @Input() points: Point[] = [];
  @Input() mode: Mode = Mode.FLIP;
  @Output()
  pointsChanged = new EventEmitter<Point[]>

  changeStatus(point: Point): void {
    if(this.mode == Mode.FLIP) {
      point.status = point.status === Status.IN ? Status.OUT : Status.IN;
    } else {
      point.status = this.mode == Mode.IN? Status.IN : Status.OUT;
    }
    this.pointsChanged.emit(this.points)
  }

  protected readonly Status = Status;

  selecting = false;
  startDrag = false;
  selectionStart = { x: 0, y: 0 };
  selectionEnd = { x: 0, y: 0 };
  movementThreshold = 5; // Threshold in pixels

  ngOnInit() {
    const imageContainer = document.querySelector('.image');

    if (imageContainer) {
      fromEvent(imageContainer, 'mousemove')
        .subscribe(event => this.updateSelection(event as MouseEvent));
    }

    fromEvent(document, 'keydown').subscribe((event) => {
      this.handleKeyDown(event as KeyboardEvent);
    });
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.abortSelection();
    }
  }

  abortSelection() {
    this.selecting = false;
    this.startDrag = false;
    this.selectionStart = {x: 0, y: 0};
    this.selectionEnd = {x: 0, y: 0};
  }

  startSelection(event: MouseEvent) {
    this.startDrag = true;
    this.selectionStart = { x: event.offsetX, y: event.offsetY };
    this.selectionEnd = { x: event.offsetX, y: event.offsetY }; // Initialize selectionEnd as well
  }

  updateSelection(event: MouseEvent) {
    if (!this.startDrag) return;

    const deltaX = event.offsetX - this.selectionEnd.x;
    const deltaY = event.offsetY - this.selectionEnd.y;
    const maxChange = 100; // Maximum change allowed per update


    // Check if the movement is within the acceptable range
    if (Math.abs(deltaY) <= maxChange) {
      if (!this.selecting && (Math.abs(deltaY) > this.movementThreshold)) {
        this.selecting = true;
      }

      if (this.selecting) {
        this.selectionEnd = { x: event.offsetX, y: event.offsetY };
      }
    }
  }


  endSelection() {
    if (this.selecting) {
      this.updatePointStatuses();
    }
    this.selecting = false;
    this.startDrag = false;
  }


  updatePointStatuses() {
    // Determine the bounds of the rectangle
    const bounds = {
      left: Math.min(this.selectionStart.x, this.selectionEnd.x),
      right: Math.max(this.selectionStart.x, this.selectionEnd.x),
      top: Math.min(this.selectionStart.y, this.selectionEnd.y),
      bottom: Math.max(this.selectionStart.y, this.selectionEnd.y),
    };

    // Update the status of points within the bounds
    this.points.forEach(point => {
      if (point.x >= bounds.left && point.x <= bounds.right &&
        point.y >= bounds.top && point.y <= bounds.bottom) {
        // Change the status of the point
        // For example, to toggle:
        if(this.mode == Mode.FLIP) {
          point.status = point.status === Status.IN ? Status.OUT : Status.IN;
        } else {
          point.status = this.mode == Mode.IN? Status.IN : Status.OUT;
        }
      }
    });
  }

  getSelectionStyle() {
    // Calculate the top-left corner of the rectangle
    const left = Math.min(this.selectionStart.x, this.selectionEnd.x);
    const top = Math.min(this.selectionStart.y, this.selectionEnd.y);

    // Calculate the dimensions of the rectangle
    const width = Math.abs(this.selectionStart.x - this.selectionEnd.x);
    const height = Math.abs(this.selectionStart.y - this.selectionEnd.y);

    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`
    };
  }
}
