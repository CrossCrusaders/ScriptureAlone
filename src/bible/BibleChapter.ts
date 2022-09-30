export interface BibleBook {
  bookId: string
  sequenceNumber: number
  name: string
  nameShort: string
}

export interface BibleChapter extends BibleBook {
  chapterNumber: number
}


export interface BibleVerse {
  book_id: string
  book_name: string
  book_name_alt: string
  chapter: number
  chapter_alt: string
  verse_end: number
  verse_end_alt: string
  verse_start: number
  verse_start_alt: string
  verse_text: string
}

export interface BibleTranslation {
  id: string,
  name: string
  abbreviation: string
}