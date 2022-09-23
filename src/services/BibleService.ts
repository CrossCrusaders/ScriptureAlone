import PocketBase from 'pocketbase'
const client = new PocketBase('https://dev.api.scripturealone.app');
export const bibleIdKjv = 'de4e12af7f28f599-02';

export async function getVerseOfTheDay(){
	const record = await client.records.getOne('versesOfTheDay', 'gp1basmzaxumy5x', {
		expand: 'verseId'
	});
	console.log(record.verseId);
	

	const DailyVerse = await getVerse(`https://dev.api.scripturealone.app/api/bibles/verses?bible_id=${bibleIdKjv}&verse_id=${record.verseId}`);
	console.log(DailyVerse)

	return DailyVerse;
}

export async function getVerse(url:any) {
	const response = await fetch(url);
	const results = await response.json();
	return results;
};