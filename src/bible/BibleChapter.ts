import { BibleVerse } from './BibleVerse';
import { BibleBook } from './BibleBook'

export interface BibleChapter extends BibleBook {
  chapterNumber: number
  verses: BibleVerse[]
  header: string
  footer: string
  language: string
}
