import Config from "../../config/services/ConfigService";
import { transformWordResponse } from '../Word'

export async function getWord(word: string) {
    word = word.charAt(0).toUpperCase() + word.slice(1);
    
    var url = `${Config.websters1828Dictionary}/${word[0]}/${word}.json`;
    const wordResponse = await fetch(url);
    const wordResults = await wordResponse.json();

    return transformWordResponse(wordResults);
}