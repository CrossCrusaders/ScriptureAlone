import PocketBaseClient from '../../api/PocketBaseClient'
import Config from '../../config/services/ConfigService'
import { getLocalCacheItem, getSessionCacheItem, setLocalCacheItem, setSessionCacheItem } from '../../cache/services/LocalStorageService'
import { BibleBook, BibleBookLookup } from '../BibleBook'
import { BibleChapter } from '../BibleChapter'
import { BibleVerse } from '../BibleVerse'
import { getDayOfTheYear } from '../../core/services/TimeService'

export const bibleIdKjv = 'ENGKJV'

const votdCacheKey = `__scripture_alone_votd__`

let versesOfTheDayCache: any = null

let cacheLoaded = false
let bibleChaptersCache: BibleChapter[] | null = null
let bibleBooksCache: BibleBook[] | null = null
let bibleTranslationsCache: any[] | null = null
let bibleBookLookupCache: BibleBookLookup[] | null = null



export async function getVerseOfTheDay() {
	if (!versesOfTheDayCache) {
		versesOfTheDayCache = await getSessionCacheItem(votdCacheKey)
		if (!versesOfTheDayCache) {
			const verses = await PocketBaseClient.records.getFullList('versesOfTheDay')
			versesOfTheDayCache = verses
			await setSessionCacheItem(votdCacheKey, verses)
		}
	}

	const length = versesOfTheDayCache.length
	const chosenIndex = getDayOfTheYear() % length
	const chosenVerse = versesOfTheDayCache[chosenIndex]

	const verses = chosenVerse.verseId.split('-')

	let verseResponse = []
	let verseReference = ''

	if (verses.length === 2) {
		const [book, chapter, verse1] = verses[0].split('.')
		const [_, __, verse2] = verses[1].split('.')
		verseResponse = await getVerses(bibleIdKjv, book, chapter, verse1, verse2)
		verseReference = `${verseResponse[0].book_name} ${chapter}:${verse1}-${verse2}`
	} else if (verses.length === 1) {
		const [book, chapter, verse] = verses[0].split('.')
		verseResponse = await getVerses(bibleIdKjv, book, chapter, verse, verse)
		verseReference = `${verseResponse[0].book_name} ${chapter}:${verse}`
	} else {
		throw new Error('Invalid Verse of the Day Format')
	}

	const verseText = verseResponse.reduce((aggregate, verse) => {
		return aggregate + `<span class="verse-number">${verse.verse_start_alt}</span>${verse.verse_text} `
	}, '')

	return {
		verseReference,
		verseText
	}
}

/**
 * Primary function for querying the bible API
 * and getting bible verses
 */
export async function getVerses(bibleId: string, book: string, chapter: number, startVerse?: number, endVerse?: number): Promise<BibleVerse[]> {

	let key = `${bibleId}.${book}.${chapter}`
	if (startVerse) {
		key += `.${startVerse}`
		if (endVerse) {
			key += `.${endVerse}`
		}
	}

	const dataStr = await getLocalCacheItem(key)
	if (dataStr)
		return JSON.parse(dataStr)


	let url = `${Config.bibleApiUrl}bibles/filesets/${bibleId}/${book}/${chapter}?v=4`

	if (startVerse)
		url += `&verse_start=${startVerse}`

	if (endVerse)
		url += `&verse_end=${endVerse}`

	const response = await fetch(url);
	const results = await response.json();
	const data = results.data;

	await setLocalCacheItem(key, JSON.stringify(data))
	return data
}

export async function checkVersesForHighlight(book:string, chapter:string){
	var filter = `book_id="${book}" && chapter=${chapter} && user="${PocketBaseClient.authStore.model?.id}"`
	var returnVerses = await PocketBaseClient.records.getFullList('highlights', 200, { filter })
	return returnVerses;
}

export async function getUserHighlightedVerses(id:string){
	var returnVerses = await PocketBaseClient.records.getFullList('highlights', 200, { filter: `user="${id}"` })
	return returnVerses;
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
	bibleChaptersCache.forEach(chapter => {
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
		.filter(item => item.bookId.toLowerCase() === bookId.toLowerCase())
		.sort((a, b) => a.sequenceNumber - b.sequenceNumber)
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

export async function getTranslations() {
	return bibleCacheMonad(() => bibleTranslationsCache)
}

export async function getTranslationById(translationId: string) {
	return bibleCacheMonad(() => bibleTranslationsCache?.find(tr => tr.id == translationId))
}

export async function getPreviousChapterBySequenceNumber(sequenceNumber: number) {
	return bibleCacheMonad(() => _getPreviousChapterBySequenceNumber(sequenceNumber))
}

export async function getNextChapterBySequenceNumber(sequenceNumber: number) {
	return bibleCacheMonad(() => _getNextChapterBySequenceNumber(sequenceNumber))
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

export async function searchBible(bibleId: string, query: string, page: number, perPage: number) {

	const url = `${Config.bibleApiUrl}search?query=${encodeURI(query)}&fileset_id=${bibleId}&limit=${perPage}&page=${page}&v=4`

	const searchResponse = await fetch(url)
	const searchResults = await searchResponse.json()

	return searchResults.verses as {
		data: BibleVerse[], meta: BibleSearchMeta
	}
}

export function getReferenceFromVerse(verse: BibleVerse) {
	let reference = `${verse.book_name} ${verse.chapter}:${verse.verse_start}`
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
		verse_text: '',
		highlight: ""
	}
	return bibleVerseRef

}

export async function highlightVerse(book_id: string, chapter: number | string, verse: number | string, color: string){
	let update = null;
	var verses = await checkVersesForHighlight(book_id, chapter.toString());
	verses.forEach((v:any)=>{
		if(v.verse == verse)
			update = v.id;
	})
	if(update){
		if(color == "none"){
			await PocketBaseClient.records.delete('highlights', update);
			return;
		}
		await PocketBaseClient.records.update('highlights', update, { color })
	}
	else{
		await PocketBaseClient.records.create('highlights', { book_id, chapter, verse, user: PocketBaseClient.authStore.model?.id, color })
	}
}