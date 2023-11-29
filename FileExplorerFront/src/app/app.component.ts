import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FileExplorerService } from '../services/fileexplorer.service';
import { DirectoryRequest } from '../types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  explorerService = inject(FileExplorerService)
  current_path = "/Users/nadavavnon/Desktop/medexweb"

  image = signal<string | null>(null)

  ngOnInit(): void {
    this.readDirectory()
  }

  dirBack() {
    const pathComponents = this.current_path.split("/") // ["users", "nadavavnon", "Desktop", "medexweb"]
    if (pathComponents.length >= 2) {
      this.current_path = pathComponents.slice(0, pathComponents.length - 1).join("/")
      this.readDirectory()
    }
  }

  readDirectory() {
    let request: DirectoryRequest = {
      path: this.current_path
    }
    this.explorerService.getDirectory(request)
      .subscribe(({ data: files }) => {
        // all images
        let images = files.filter(file => !file.isDirectory && file.mimeType.includes("image"))
        // all pdfs
        let pdfs = files.filter(file => !file.isDirectory && file.mimeType.includes("pdf"))
        // blob -> objectdataurl => <img src={objectdataurl}/>
        if (images.length > 0) {
          let first_image = images[0]
          let file_request: DirectoryRequest = {
            path: first_image.path
          }

          this.explorerService.getFile(file_request).subscribe(dataUrl => {
            console.log(dataUrl)
            this.image.set(dataUrl)
          })
        }
      })
  }



}
