import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { DirectoryRequest, DirectoryResponse, FileData, MimeType } from "../types";
import { Observable, firstValueFrom, map, switchMap } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class FileExplorerService {

    httpClient = inject(HttpClient)

    current_path = "/Users/nadavavnon/Desktop/medexweb"
    directoryContent = signal<FileData[]>([])
    // constructor(client: HttpClient) {
    //     this.httpClient = client;
    // }

    getDirectory(request: DirectoryRequest): Observable<DirectoryResponse> {
        return this.httpClient.post<DirectoryResponse>("directory", request)
    }



    getFile(request: DirectoryRequest, mimeType: MimeType): Observable<string> { // Bytes Large Object
        return this.httpClient.post<Blob>("file", request, {
            responseType: "blob" as "json"
        }).pipe(
            switchMap(async (blob) => {
                if (mimeType == MimeType.Image) {
                    return await this.readBlobAsDataUrl(blob)
                } else {
                    return this.readBlobAsObjectURL(blob)
                }
            })
        )
    }

    private readBlobAsDataUrl(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function () {
                resolve(reader.result as string)
            }
            reader.onerror = () => {
                reject(reader.error)
            }

            reader.readAsDataURL(blob)
        })
    }

    private readBlobAsObjectURL(blob: Blob): string {
        return URL.createObjectURL(blob)
    }

    dirBack() {
        const pathComponents = this.current_path.split("/")
        if (pathComponents.length >= 2) {
            this.current_path = pathComponents.slice(0, pathComponents.length - 1).join("/")
            this.readDirectory()
        }
    }

    openDirectory(path: string) {
        this.current_path = path
        // read the directory content only when required (user clicked the directory)
        this.readDirectory()
    }


    IsImageFile(file: FileData) {
        return !file.isDirectory && file.mimeType.includes("image")
    }
    IsPDFFile(file: FileData) {
        return !file.isDirectory && file.mimeType.includes("pdf")
    }

    onlyFiles() {
        return this.directoryContent().filter(data => !data.isDirectory)
    }
    readDirectory() {
        let request: DirectoryRequest = {
            path: this.current_path
        }
        this.getDirectory(request)
            .subscribe(async ({ data: files }) => {
                // signal all files
                this.directoryContent.set(files)
                // process the images the current directory
                // all images
                let imagesData = files.filter(this.IsImageFile)
                // all pdfs
                let pdfsData = files.filter(this.IsPDFFile)

                let all_files = files.filter(file => !this.IsImageFile(file) && !this.IsPDFFile(file))

                const promises = imagesData.map(image => firstValueFrom(this.getFile({
                    path: image.path,
                }, MimeType.Image).pipe(
                    map((data_url: string) => {
                        return {
                            ...image,
                            data_url
                        } as FileData
                    })
                )))
                const pdf_promises = pdfsData.map(image => firstValueFrom(this.getFile({
                    path: image.path,
                }, MimeType.PDF).pipe(
                    map((data_url: string) => {
                        return {
                            ...image,
                            data_url
                        } as FileData
                    })
                )))

                try {
                    const images = await Promise.all(promises)
                    const pdfs = await Promise.all(pdf_promises)

                    all_files = [...all_files, ...images, ...pdfs]
                    this.directoryContent.set(all_files)
                } catch (e) {
                    console.log(e)
                }
            })
    }


}