export interface BibleChapter {
  id: string
  content: string
  copyright: string
  next: { id: string, number: string, bookId: string }
  previous: { id: string, number: string, bookId: string },
  reference: string,
  verseCount: number
}