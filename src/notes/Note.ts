import { getVerses } from "../bible/services/BibleService"
import { getLocalCacheItem } from "../cache/services/LocalStorageService"

export interface Note {
    id?: string
    created?: Date
    updated?: Date
    collectionId?: string
    collectionName?: string

    title: string
    text: string
    verses: any[]
    book_id: string
    chapter: number
}

export const transformNoteResponse = (response: any): Note => {
    const note: Note = {
        ...response,
        collectionId: response['@collectionId'],
        collectionName: response['@collectionName'],
    }
    
    return note;
}

export const transformNoteResponses = (responses: any[]) =>
    responses.map(r => transformNoteResponse(r))