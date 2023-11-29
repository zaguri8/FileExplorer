import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { DirectoryRequest, DirectoryResponse } from "../types";
import { Observable, switchMap } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class FileExplorerService {

    httpClient = inject(HttpClient)
    // constructor(client: HttpClient) {
    //     this.httpClient = client;
    // }

    getDirectory(request: DirectoryRequest): Observable<DirectoryResponse> {
        return this.httpClient.post<DirectoryResponse>("directory", request)
    }

    getFile(request: DirectoryRequest): Observable<string> { // Bytes Large Object
        return this.httpClient.post<Blob>("file", request, {
            responseType: "blob" as "json"
        }).pipe(
            switchMap(this.readBlobAsObjectUrl)
        )
    }

    private readBlobAsObjectUrl(blob: Blob): string {
        let objectURL = URL.createObjectURL(blob);
        return objectURL
    }

}