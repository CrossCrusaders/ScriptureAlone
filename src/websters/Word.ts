export interface Word {
    word: string
    pronunciation: string
    definition: {
        type: string
        text: string
    }
}

export const transformWordResponse = (response: any): Word => {
    return response as Word
}