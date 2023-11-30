
interface DirectoryRequest {
    path: string
}

interface FileData {
    name: string
    path: string
    mimeType: string
    isDirectory: boolean
    data_url?: string
}

interface DirectoryResponse {
    data: FileData[]
}
export enum MimeType {
    PDF, Image
}
export {
    DirectoryRequest,
    FileData,
    DirectoryResponse
}
