import PocketBaseClient from '../../api/PocketBaseClient'
import { transformNoteResponse, transformNoteResponses } from '../Note';

export async function createNote(book_id: string, chapter: string | number, verses: any, title: string, text: string) {
    await PocketBaseClient.records.create('notes', { title, book_id, chapter, verses, text, user: PocketBaseClient.authStore.model?.id });
}

export async function getNote(id: string) {
    const response = await PocketBaseClient.records.getOne('notes', id);
    return transformNoteResponse(response);
}

export async function getAllNotesInChapter(book_id: string, chapter: number){
    const response = await PocketBaseClient.records.getFullList('notes', 200, { filter: `book_id="${book_id}"&&chapter=${chapter}&&user="${PocketBaseClient.authStore.model?.id}"` });
    return transformNoteResponses(response);
}