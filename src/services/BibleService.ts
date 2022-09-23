import PocketBase from 'pocketbase'
const client = new PocketBase('https://dev.api.scripturealone.app');

export async function getVerseOfTheDay(){
	const record = await client.records.getOne('versesOfTheDay', 't7hx4mcd4jlptqz', {
		expand: 'verseId'
	});
	console.log(record.verseId);
}