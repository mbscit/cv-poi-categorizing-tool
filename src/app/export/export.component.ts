import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Point} from "../point";

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './export.component.html',
  styleUrl: './export.component.css'
})
export class ExportComponent {

  @Input()
  points: Point[] = []
  @Input() fileName: string = ''

  export() {
    const csvContent = this.points.map(point => {
      let row = `${point.x},${point.y},${point.status}`;
      if(point.attrs.length > 0) {
        row += `,${point.attrs.join(',')}`
      }
      return row;

    }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName + '_points.csv';
    a.click();

    window.URL.revokeObjectURL(url);
  }
}
