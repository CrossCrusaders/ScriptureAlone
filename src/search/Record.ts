import { Author } from "../authors/Author"

export interface Record {
    // Global
    id: string
    title: string
    collectionId: string
    collectionName: string
    coverImage: any

    description?: string
    externalAudioFileUrl?: string
    externalCoverImageUrl?: string
    externalVideoFileUrl?: string
    audioFile?: string,
  
    transcript?: string
    created?: Date
    updated?: Date
  
    categories?: Category[]
    author?: Author
    sermonDate?: Date
    devotionalDate?: Date
    truthResourceDate?: Date
    noteDate?: Date
  
    duration?: number
}

export interface Category {
    created: Date,
    iconName: string
    id: string
    label: string
    updated: Date
    colorEnd: string
    colorStart: string
    textColor: string
    customCss: any
    key: string
}