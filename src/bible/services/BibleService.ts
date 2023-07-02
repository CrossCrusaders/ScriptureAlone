import PocketBaseClient from '../../api/PocketBaseClient'
import Config from '../../config/services/ConfigService'
import { BibleBook, BibleBookLookup } from '../BibleBook'
import { BibleChapter } from '../BibleChapter'
import { BibleVerse } from '../BibleVerse'
import { getDayOfTheYear } from '../../core/services/TimeService'

let cacheLoaded = false
let bibleChaptersCache: BibleChapter[] | any = null
let bibleBooksCache: BibleBook[] | null = null
let bibleBookLookupCache: BibleBookLookup[] | null = null
let bibleTranslationsCache: any[] | null = null



export async function getVerseOfTheDay() {
	const votdVerses = await PocketBaseClient.records.getFullList('versesOfTheDay')

	const length = votdVerses.length
	const chosenIndex = getDayOfTheYear() % length
	const chosenVerse = votdVerses[chosenIndex]

	const verses = chosenVerse.verseId.split('-')

	let verseResponse = { verses: [{ verse_start: 0, text: "", book_name: "" }]  }
	let verseReference = ''
	let verseBookId, verseChapter

	if (verses.length === 2) {
		const [book, chapter, verse1] = verses[0].split('.')
		verseBookId = book.toUpperCase();
		verseChapter = chapter;
		const [_, __, verse2] = verses[1].split('.')
		verseResponse = await getVerses(book, chapter, verse1, verse2)
		verseReference = `${verseResponse.verses[0].book_name} ${chapter}:${verse1}-${verse2}`
	} else if (verses.length === 1) {
		const [book, chapter, verse] = verses[0].split('.')
		verseBookId = book.toUpperCase();
		verseChapter = chapter;
		verseResponse = await getVerses("KJB1762", book, chapter, verse, verse)
		verseReference = `${verseResponse.verses[0].book_name} ${chapter}:${verse}`
	} else {
		throw new Error('Invalid Verse of the Day Format')
	}

	const verseText = verseResponse.verses.reduce((aggregate, verse) => {
		return aggregate + `<span class="verse-number">${verse.verse_start}</span>${verse.text.replaceAll('"JESUS_START" ', '<span class="text-red-500">').replaceAll(' "JESUS_END"', "</span>")} `
	}, '')

	return {
		verseReference,
		verseText,
		verseBookId,
		verseChapter
	}
}

/**
 * Primary function for querying the bible API
 * and getting bible verses
 */
export async function getVerses(translation: string, book: string, chapter: number, startVerse?: number, endVerse?: number): Promise<{
[x: string]: any, header: string, verses: BibleVerse[], footer: string 
}> {
	book = book.toUpperCase();
	var data:any = null;
	data = { ...await(await import(`../../assets/bible-json/${translation}/${book}/${chapter}.json`)).default };

	if (!startVerse)
		return data;
	else {
		if (endVerse) {
			data.verses = data.verses.filter(function (verse: any) {
				return (verse.verse_start >= startVerse && verse.verse_end <= endVerse);
			});
			return data;
		}
		else {
			data.verses = data.verses.filter(function (verse: any) {
				return verse.verse_start == startVerse;
			});
			return data;
		}
	}
}

export async function getHighlightedVerses(book: string, chapter: string) {
	var filter = `book_id="${book}" && chapter=${chapter} && user="${PocketBaseClient.authStore.model?.id}"`
	var returnVerses = await PocketBaseClient.records.getFullList('highlights', 200, { filter })
	return returnVerses[0];
}

export async function getUserHighlightedVerses() {
	var returnVerses = await PocketBaseClient.records.getFullList('highlights', 200, { filter: `user="${PocketBaseClient.authStore.model?.id}"` })
	var verses: any = [];
	returnVerses.forEach((chapter: any) => {
		chapter.verse_data.forEach((verse: any) => {
			verses.push({ book_id: chapter.book_id, chapter: chapter.chapter, verse })
		})
	});
	return verses;
}

async function loadBibleData() {
	const BibleTranslations = await import(`../../assets/bible/translations.json`)
	const BibleBookChapters = await import(`../../assets/bible/bible-books.json`)
	const BibleBookLookup = await import('../../assets/bible/bible-book-lookup.json')
	bibleTranslationsCache = BibleTranslations.default
	bibleChaptersCache = BibleBookChapters.default
	bibleBookLookupCache = BibleBookLookup.default

	// Map the chapters to the unique books of the bible
	// for selection purposes
	const bibleBooksHash: any = {}
	bibleBooksCache = []
	bibleChaptersCache?.forEach((chapter:any) => {
		if (!bibleBooksHash[chapter.bookId]) {
			bibleBooksHash[chapter.bookId] = true
			const book = { ...chapter }

			bibleBooksCache?.push(book)
		}
	})

	cacheLoaded = true
}

async function bibleCacheMonad(fn: Function) {
	if (!cacheLoaded) {
		await loadBibleData()
	}
	return await fn()
}

async function _getChaptersByBookId(bookId: string) {
	return bibleChaptersCache!
		.filter((item:any) => item.bookId.toLowerCase() === bookId.toLowerCase())
		.sort((a:any, b:any) => a.sequenceNumber - b.sequenceNumber)
}

async function _getChapterBySequenceNumber(sequenceNumber: number) {
	if (sequenceNumber < 0 || sequenceNumber >= bibleChaptersCache!.length) {
		return null
	}
	return bibleChaptersCache![sequenceNumber]
}

async function _getBooks() {
	return bibleBooksCache
}

async function _getPreviousChapterBySequenceNumber(sequenceNumber: number) {
	if (sequenceNumber == 0) {
		sequenceNumber = bibleChaptersCache!.length - 1
	} else {
		sequenceNumber = sequenceNumber - 1
	}
	return _getChapterBySequenceNumber(sequenceNumber)
}

async function _getNextChapterBySequenceNumber(sequenceNumber: number) {
	if (sequenceNumber >= bibleChaptersCache!.length - 1) {
		sequenceNumber = 0
	} else {
		sequenceNumber = sequenceNumber + 1
	}
	return _getChapterBySequenceNumber(sequenceNumber)
}

async function _getBookIdBySearchTerm(term: string) {
	return bibleBookLookupCache!.find(book => {
		const matchingTerm = book.searchTerms.find(bookTerm => bookTerm.toLowerCase().trim() == term.toLowerCase().trim())
		return !!matchingTerm
	})
}

export async function getChaptersByBookId(bookId: string) {
	return bibleCacheMonad(() => _getChaptersByBookId(bookId))
}

export async function getChapterBySequenceNumber(sequenceNumber: number) {
	return bibleCacheMonad(() => _getChapterBySequenceNumber(sequenceNumber))
}

export async function getBooks() {
	return bibleCacheMonad(() => _getBooks())
}

export async function getPreviousChapterBySequenceNumber(sequenceNumber: number) {
	return bibleCacheMonad(() => _getPreviousChapterBySequenceNumber(sequenceNumber))
}

export async function getNextChapterBySequenceNumber(sequenceNumber: number) {
	return bibleCacheMonad(() => _getNextChapterBySequenceNumber(sequenceNumber))
}

export async function getTranslations() {
	return bibleCacheMonad(() => bibleTranslationsCache)
}

export async function getTranslationById(translationId: string) {
	return bibleCacheMonad(() => bibleTranslationsCache?.find(tr => tr.id == translationId))
}

export interface BibleSearchMetaPagination {
	count: number
	current_page: number
	per_page: number
	total: number
	total_pages: number
}

export interface BibleSearchMeta {
	pagination: BibleSearchMetaPagination
}

export async function searchBible(query: string, page: number, perPage: number) {
	const url = `${Config.bibleApiUrl}search?query=${encodeURI(query)}&fileset_id=ENGKJV&limit=${perPage}&page=${page}&v=4`

	const searchResponse = await fetch(url)
	const searchResults = await searchResponse.json()

	return searchResults.verses as {
		data: BibleVerse[], meta: BibleSearchMeta
	}
}

export function getReferenceFromVerse(verse: BibleVerse) {
	let reference = `${verse.book_name_alt} ${verse.chapter}:${verse.verse_start}`
	if (verse.verse_start != verse.verse_end)
		reference += `-${verse.verse_end}`
	return reference
}

export async function getBookIdBySearchTerm(term: string) {
	return bibleCacheMonad(() => _getBookIdBySearchTerm(term))
}

const bibleReferenceRegex = /(\d*)\s*([a-z]+)\s*(\d+)(?::(\d+))?(\s*-\s*(\d+)(?:\s*([a-z]+)\s*(\d+))?(?::(\d+))?)?/i
export async function isBibleReference(query: string) {
	const tokens = bibleReferenceRegex.exec(query)
	if (!tokens)
		return false

	let [fullQuery,
		numericModifier,
		bookName,
		chapter,
		startVerse,
		dashedEndverse,
		endVerse
	] = tokens

	let bookSearchTerm = `${numericModifier ? numericModifier + ' ' : ''}${bookName}`

	const book: BibleBookLookup = await getBookIdBySearchTerm(bookSearchTerm)
	if (!book)
		return null

	const bibleVerseRef: BibleVerse = {
		book_id: book.bookId,
		book_name: book.name,
		chapter: parseInt(chapter, 10),
		verse_start: parseInt(startVerse),
		verse_end: parseInt(endVerse || startVerse),
		text: '',
		highlight: ""
	}
	return bibleVerseRef

}

export async function highlightVerses(book: string, chapter: string, verses: number[], color: string) {
	var currentlyHighlightedVerses: any = await getHighlightedVerses(book, chapter);
	var newCurrentlyHighlightedVerses: any[] = [];
	if (!currentlyHighlightedVerses) {
		await PocketBaseClient.records.create("highlights", { book_id: book, chapter, user: PocketBaseClient.authStore.model?.id, verse_data: [] }).then(async () => {
			currentlyHighlightedVerses = await getHighlightedVerses(book, chapter);
			newCurrentlyHighlightedVerses = currentlyHighlightedVerses.verse_data || [];
		})
	}
	else {
		newCurrentlyHighlightedVerses = currentlyHighlightedVerses.verse_data || [];
	}
	verses.forEach((verse: any) => {
		let found = false;
		newCurrentlyHighlightedVerses.forEach((v: any, i: number) => {
			if (v.verse.toString() == verse.toString()) {
				if (color != "none") {
					newCurrentlyHighlightedVerses[i].color = color;
					found = true;
					return;
				}
				else {
					newCurrentlyHighlightedVerses.splice(i, 1);
					found = true;
					return;
				}
			}
		})
		if (!found) {
			newCurrentlyHighlightedVerses.push({ verse, color });
		}
	});
	if (newCurrentlyHighlightedVerses[0] === (undefined || null)) {
		return PocketBaseClient.records.delete("highlights", currentlyHighlightedVerses.id);
	}
	else {
		return PocketBaseClient.records.update("highlights", currentlyHighlightedVerses.id, { verse_data: newCurrentlyHighlightedVerses });
	}
}