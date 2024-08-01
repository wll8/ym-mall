export interface FileList {
  status: 'uploading' | 'success' | 'failed'
  message?: string
  url?: string
}
