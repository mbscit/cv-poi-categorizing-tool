import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Point} from "../point";
import {Status} from "../status"
import {FileData} from "../file-data"

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  @Output() imageLoaded = new EventEmitter<FileData>;
  @Output() csvLoaded = new EventEmitter<Point[]>(); // You can define a more specific type for the data

  constructor() {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      const name = file.name.replace(/\.[^/.]+$/, "");

      reader.onload = e => {
        this.imageLoaded.emit({ name: name, content: reader.result })
      };
      reader.readAsDataURL(file);
    }
  }

  onCSVSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const text = reader.result as string;
        const rows = text.split('\n');

        const points: Point[] = [];

        for (let i = 0; i < rows.length; i++) {
          const cols = rows[i].split(',');

          if (cols.length > 1) {
            const point: Point = {
              x: +cols[0],
              y: +cols[1],
              status: cols.length > 2? +cols[2] : Status.IN,
              attrs: cols.slice(3)
            };

            points.push(point);
          } else {
            alert("invalid format")
          }
        }

        this.csvLoaded.emit(points);
      };

      reader.readAsText(file);
    }
  }
}
