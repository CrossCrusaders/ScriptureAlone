
import PocketBaseClient from '../../api/PocketBaseClient';
import Config from '../../core/services/ConfigService';
import { BibleChapter } from '../BibleChapter';
export const bibleIdKjv = 'de4e12af7f28f599-02';

const votdCacheKey = `__scripture_alone_votd__`
const votdCachedItem = sessionStorage.getItem(votdCacheKey)
let versesOfTheDayCache = votdCachedItem ? JSON.parse(votdCachedItem) : null


export async function getVerseOfTheDay() {
	if (!versesOfTheDayCache) {
		const verses = await PocketBaseClient.records.getFullList('versesOfTheDay')
		versesOfTheDayCache = verses
		sessionStorage.setItem(votdCacheKey, JSON.stringify(verses))
	}

	const today = new Date().setHours(0, 0, 0, 0)
	const length = versesOfTheDayCache.length

	const chosenIndex = Math.floor((today / 1000000)) % length
	const chosenVerse = versesOfTheDayCache[chosenIndex]

	const record = await PocketBaseClient.records.getOne(
		'versesOfTheDay', chosenVerse.id)
	const dailyVerse = await getVerse(record.verseId);

	return dailyVerse;
}

export async function getVerse(verse: string) {
	const response = await fetch(`${Config.pocketBaseApiUrl}api/bibles/verses?bible_id=${bibleIdKjv}&verse_id=${verse}`);
	const results = await response.json();
	return results;
}

export async function getChapter(
	bookId: string,
	chapterNumber: number,
	bibleId: string = bibleIdKjv): Promise<BibleChapter> {
	const response = await fetch(`${Config.pocketBaseApiUrl}api/bibles/chapters?bible_id=${bibleId}&chapter_id=${bookId}.${chapterNumber}`);
	const results = await response.json();
	return results.data;
}

export const bibleBookIds = []

