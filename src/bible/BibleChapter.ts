export interface BibleChapter {
  id: string
  content: string
  copyright: string
  next: { id: string, number: string, bookId: string }
  previous: { id: string, number: string, bookId: string },
  reference: string,
  verseCount: number
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