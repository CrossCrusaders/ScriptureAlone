import PocketBase from 'pocketbase'
const client = new PocketBase('https://dev.api.scripturealone.app');
export const bibleIdKjv = 'de4e12af7f28f599-02';

export async function getVerseOfTheDay(verse:any){
	//Verse var is just for testing. We will need to make a var in the database and grab the verse from there.

	const record = await client.records.getOne('versesOfTheDay', 'gp1basmzaxumy5x', {
		expand: 'verseId'
	});

	const DailyVerse = await getVerse(verse);

	console.log(DailyVerse)
    
	return DailyVerse;
}

export async function getNewDailyVerse(){
	//Gets a list of all the verses
	const verseList = await client.records.getFullList('versesOfTheDay', 200, {
		expand: 'verseId'
	});

	//Gets a random number
	var verseNum = Math.floor(Math.random() * verseList.length - 1);

	//Will be where only the verse abbreviations will be
	var verseListUpdated:any = [];

	//Sets the "verseListUpdated" var
	verseList.forEach(x => verseListUpdated.push(x.verseId));

	//Returns the verse abbreviation
	while(verseListUpdated[verseNum] == undefined){}
	return verseListUpdated[verseNum];
}

export async function getVerse(verse:any) {
	const response = await fetch(`https://dev.api.scripturealone.app/api/bibles/verses?bible_id=${bibleIdKjv}&verse_id=${verse}`);
	const results = await response.json();
	return results;
};