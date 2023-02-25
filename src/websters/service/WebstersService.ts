import Config from "../../config/services/ConfigService";

export async function getWord(word: string){
    var url = `${Config.websters1828Dictionary}/${word}`;
    const wordResponse = await fetch(url);
	const wordResults = await wordResponse.json();

    return wordResults;
}