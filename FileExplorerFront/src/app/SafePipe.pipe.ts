import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";


// this is used so we can use pdf urls from the service computer inside <iframe/>
@Pipe({
    name: 'safe',
    standalone: true
})
export class SafePipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }
    transform(url: any) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

}