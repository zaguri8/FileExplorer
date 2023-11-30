


import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FileExplorerService } from '../services/fileexplorer.service';
import { DirectoryRequest, FileData } from '../types';
import { firstValueFrom } from 'rxjs';




@Component({
    selector: 'explorer-menu',
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './explorer-menu.component.html',

    styleUrls: ['./explorer-menu.component.scss']
})
export class ExplorerMenuComponent {


    explorerService = inject(FileExplorerService)


  
 
}