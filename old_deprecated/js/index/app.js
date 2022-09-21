import verses from '../../node_modules/kjv/json/verses-1769.json';
verses = JSON.stringify(verses);
 
console.log(verses['John 3:16'])

const hamburger_menu = document.querySelector(".hamburger-menu");
const container = document.querySelector(".container");
const ShareVerseBtn = document.getElementById("ShareBtn");
const VerseText = document.getElementById("TextVerse");
const VerseName = document.getElementById("TextVerseName");

var VerseNamePlusText;

const VerseSearch = document.getElementById("VerseSearchBar");
const SearchBtn = document.getElementById("SearchBtn");

ShareVerseBtn.addEventListener("click", () => {
	
	VerseNamePlusText = `${VerseName.textContent}\n${VerseText.textContent}`;

	navigator.clipboard.writeText(VerseNamePlusText);
});

const get_data = async (book, chapter, verse, version) => {
    let res = await fetch(`https://jsonbible.com/search/verses.php?json={"book":${book}, "chapter":${chapter}, "verse":${verse}, "version":${version}}`)
    console.log(res.json())
    return res.json()

}   

var chips = get_data("John", "3", "16", "kjv");

hamburger_menu.addEventListener("click", () => { container.classList.toggle("active"); });

