


import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FileExplorerService } from '../services/fileexplorer.service';
import { SafePipe } from './SafePipe.pipe';




@Component({
    selector: 'file-gallery',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SafePipe],
    templateUrl: './file-gallery.component.html',
    styleUrls: ['./file-gallery.component.scss']
})
export class FileGalleryComponent {

    explorerService = inject(FileExplorerService)



}
