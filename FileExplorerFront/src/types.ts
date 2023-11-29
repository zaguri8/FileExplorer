
interface DirectoryRequest {
    path: string
}


interface FileData {
    name: string
    path: string
    mimeType: string
    isDirectory: boolean
}

interface DirectoryResponse {
    data: FileData[]
}

export {
    DirectoryRequest,
    FileData,
    DirectoryResponse
}
