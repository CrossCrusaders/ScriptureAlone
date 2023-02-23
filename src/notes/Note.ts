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

    var tempVerseHold: any[] = [];
    note.verses.forEach(async (verse: number | object) => {
        const verseResponse = await getVerses(getLocalCacheItem("__scripture_alone_last_loaded_bible_info__", true).selectedBibleTranslationId, note.book_id, note.chapter, verse as number, verse as number)
        tempVerseHold.push(verseResponse);
    });
    note.verses = tempVerseHold;
    
    return note;
}

export const transformNoteResponses = (responses: any[]) =>
    responses.map(r => transformNoteResponse(r))