export interface BibleBook {
  bookId: string
  sequenceNumber: number
  name: string
  nameShort: string
}


export interface BibleBookLookup {
  bookId: string,
  name: string,
  searchTerms: string[]
}