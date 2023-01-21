import {getBucketUrl} from "../api/BucketStorageService"

export interface Note {
    id: string,
    title: any,
    text: string,
    noteDate: Date
}


export const transformNoteResponse = (response : any) : Note => {
    const note: Note = {
        ...response,
        collectionId: response['@collectionId'],
        collectionName: response['@collectionName']
    }    

    return note;
}

export const transformNoteResponses = (responses : any[]) => responses.map(r => transformNoteResponse(r))