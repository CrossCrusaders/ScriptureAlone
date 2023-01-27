import PocketBaseClient from '../../api/PocketBaseClient'
import { transformNoteResponse } from '../Note';

export async function createNote(book_id: string, chapter: string | number, verses: Object, title: string, text: string) {
    await PocketBaseClient.records.create('notes', { title, book_id, chapter, verses, text, user: PocketBaseClient.authStore.model?.id });
}

export async function getNote(id: string) {
    const response = await PocketBaseClient.records.getOne('notes', id);
    return transformNoteResponse(response);
}