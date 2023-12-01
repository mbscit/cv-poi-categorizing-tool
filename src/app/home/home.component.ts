import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileUploadComponent} from "../file-upload/file-upload.component";
import {ImageViewComponent} from "../image-view/image-view.component";
import {Point} from "../point";
import {ModeSelectionComponent} from "../../mode-selection/mode-selection.component";
import {Mode} from "../image-view/mode";
import {ExportComponent} from "../export/export.component";
import {FileData} from "../file-data";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FileUploadComponent, ImageViewComponent, ModeSelectionComponent, ExportComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  imageSrc: string | ArrayBuffer | null = '';
  points: Point[] = [];
  mode: Mode = Mode.FLIP;
  fileName: string = ''
  result: Point[] = [];

  setImage(fileData: FileData): void {
    this.fileName = fileData.name;
    this.imageSrc = fileData.content;
  }

  setPoints(points: Point[]): void {
    this.points = points;
    this.result = points;
  }

  onModeSelected(mode: Mode) {
    this.mode = mode;
  }

  setResult($event: Point[]) {
    this.result = $event;
  }
}
