const hamburger_menu = document.querySelector(".hamburger-menu");
const container = document.querySelector(".container");
const ShareVerseBtn = document.getElementById("ShareBtn");
const VerseText = document.getElementById("TextVerse");
const VerseName = document.getElementById("TextVerseName");

var VerseNamePlusText;

ShareVerseBtn.addEventListener("click", () => {
	
	VerseNamePlusText = `${VerseName.textContent}\n${VerseText.textContent}`;

	navigator.clipboard.writeText(VerseNamePlusText);
});

hamburger_menu.addEventListener("click", () => { container.classList.toggle("active"); });

