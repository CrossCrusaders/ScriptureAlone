
import PocketBaseClient from '../../api/PocketBaseClient'
import Config from '../../core/services/ConfigService'
import { BibleBook } from '../BibleBook'
import { BibleChapter } from '../BibleChapter'

export const bibleIdKjv = 'ENGKJV'

const votdCacheKey = `__scripture_alone_votd__`
const votdCachedItem = sessionStorage.getItem(votdCacheKey)
let versesOfTheDayCache = votdCachedItem ? JSON.parse(votdCachedItem) : null

let cacheLoaded = false
let bibleChaptersCache: BibleChapter[] | null = null
let bibleBooksCache: BibleBook[] | null = null
let bibleTranslationsCache: any[] | null = null

function getDayOfTheYear() {
	var now = new Date();
	var start = new Date(now.getFullYear(), 0, 0);
	var diff = now.getTime() - start.getTime();
	var oneDay = 1000 * 60 * 60 * 24;
	var day = Math.floor(diff / oneDay);
	return day
}

export async function getVerseOfTheDay() {
	if (!versesOfTheDayCache) {
		const verses = await PocketBaseClient.records.getFullList('versesOfTheDay')
		versesOfTheDayCache = verses
		sessionStorage.setItem(votdCacheKey, JSON.stringify(verses))
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

	const dataStr = sessionStorage.getItem(key)
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

	sessionStorage.setItem(key, JSON.stringify(data))

	return data
}

async function loadBibleData() {
	const BibleTranslations = await import(`../../assets/bible/translations.json`)
	const BibleBookChapters = await import(`../../assets/bible/bible-books.json`)
	bibleTranslationsCache = BibleTranslations.default
	bibleChaptersCache = BibleBookChapters.default

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

export async function getPreviousChapterBySequenceNumber(sequenceNumber: number) {
	return bibleCacheMonad(() => _getPreviousChapterBySequenceNumber(sequenceNumber))
}

export async function getNextChapterBySequenceNumber(sequenceNumber: number) {
	return bibleCacheMonad(() => _getNextChapterBySequenceNumber(sequenceNumber))
}
