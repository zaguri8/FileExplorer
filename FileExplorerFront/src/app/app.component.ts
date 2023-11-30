import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FileExplorerService } from '../services/fileexplorer.service';
import { DirectoryRequest } from '../types';
import { ExplorerMenuComponent } from './explorer-menu.component';
import { FileGalleryComponent } from './file-gallery.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ExplorerMenuComponent, FileGalleryComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

}
