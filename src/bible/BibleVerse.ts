export interface BibleVerse {
  book_id: string
  book_name: string
  chapter: number
  verse_end: number
  verse_start: number
  text: string
  highlight: string
  verse_text?: string
  book_name_alt?: string
}
