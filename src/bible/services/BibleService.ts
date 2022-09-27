
import PocketBaseClient from '../../api/PocketBaseClient';
import Config from '../../core/services/ConfigService';
import { BibleChapter, BibleVerse } from '../BibleChapter';


// export const bibleIdKjv = 'de4e12af7f28f599-02';
export const bibleIdKjv = 'ENGKJV'

const votdCacheKey = `__scripture_alone_votd__`
const votdCachedItem = sessionStorage.getItem(votdCacheKey)
let versesOfTheDayCache = votdCachedItem ? JSON.parse(votdCachedItem) : null


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
		return aggregate + `${verse.verse_start_alt} ${verse.verse_text} `
	}, '')

	return {
		verseReference,
		verseText
	}
}

export async function getVerses(bibleId: string, book: string, chapter: number, startVerse?: number, endVerse?: number): Promise<BibleVerse[]> {
	let url = `${Config.bibleApiUrl}bibles/filesets/${bibleId}/${book}/${chapter}?v=4`

	if (startVerse)
		url += `&verse_start=${startVerse}`

	if (endVerse)
		url += `&verse_end=${endVerse}`

	const response = await fetch(url);
	const results = await response.json();
	return results.data;
}

