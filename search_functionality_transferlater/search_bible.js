"use strict";
(function () {

// MAT
// (Required) Will filter the results by the given book.
// For a complete list see the book_id field in the /bibles/books route.
//https://4.dbt.io/api/bibles/filesets/:fileset_id/:book/:chapter?verse_start=5&verse_end=5&v=4&key=
//the information input required from user to display info would be:
//fieldset_id (bible version - ENGESV/ ENGKJV/ ) value
//book (matthew - MAT) value book_id
//chapter (5...but it has to be related to book )
//verse start ... should it auto to 1?
//verse end ... should it just auto to where it ends?

//doFetchInfoForBibleBooks uses doDisplayBibleBookNames & doDisplayBibleBookChapters
//gets information book_group, book_id, book_id_osis, book_id_usfx,
// book_order, chapters, name, name_short, testament, testament_order
//doFetchInfoForBibleBook is called in doCallAllFunctions()
function doFetchInfoForBibleBooks() {
    const url_books = `https://4.dbt.io/api/bibles/ENGESV/book?book_id&v=4&key=${BIBLE_API}`;
    const options = {
        method: 'GET', headers: {
            'Content-Type': 'application/json'
        },
    };
    fetch(url_books, options).then(function (response) {
        return response.json();
    }).then(function (data) {
        // console.log(data); //
        doDisplayBibleBookNames(data);
        doDisplayBibleBookChapters(data);
    }).catch(function (jqXhr, status, error) {
        console.log(jqXhr);
        console.log(status);
        console.log(error);
    });
}

//doFetchInfoForBibleVerses is a fetch request for bible verses which the user sets the values
//it then displays (displayinformation) those values using the querySelector in doSearchOnClick();
//title for values(*data): book_id, book_name, book_name_alt, chapter, chapter_alt, verse_end, verse_end_alt,
//verse_start, verse_start_alt, verse_text
//doFetchInfoForBibleVerses is called in doSearchOnClick();
function doFetchInfoForBibleVerses(version, book, chapter, displayinformation) {
    //https://4.dbt.io/api/bibles/filesets/:fileset_id/:book/:chapter?verse_start=1&verse_end=176&v=4&key=
    //the largest number of verses in the bible is 176 so end 176
    const url = `https://4.dbt.io/api/bibles/filesets/${version}/${book}/${chapter}?verse_start=1&verse_end=176&v=4&key=${BIBLE_API}`;
    const options = {
        method: 'GET', headers: {
            'Content-Type': 'application/json'
        },
    }

    fetch(url, options).then(function (response) {
        return response.json();
    }).then(function (data) {
        // console.log(data); //title for values(*data)
        // console.log(`${data.data.length} verses in ${book} ${chapter}`); //this is how many verses there are
        let verses = '';
        data.data.forEach((value, index) => {
            let verse_number = value.verse_start;
            // console.log(value);
            verses += ` <span class="verse_number">${verse_number}</span> ${value.verse_text} `;
        });
        // console.log(verses);
        displayinformation.innerText = '';
        displayinformation.insertAdjacentHTML('beforeend', `this will display the verse. 
        ${version} ${book} ${chapter}
        <p><h1 class="lh-1 d-inline">${chapter}</h1> ${verses}</p>
        
        `)

    }).catch(function (jqXhr, status, error) {
        console.log(jqXhr);
        console.log(status);
        console.log(error);
    });
    //https://4.dbt.io/api/bibles/filesets/:fileset_id/:book/:chapter?verse_start=5&verse_end=5&v=4&key=
}


//doDisplayBibleBookNames(data) takes in data from doFetchInfoForBibleBooks()
// and makes option elements based on the data
//doDisplayBibleBookNames is called in doFetchInfoForBibleBooks();
function doDisplayBibleBookNames(data) {
    let bible_book_options = document.querySelector('.bible_book_options');


    //book_group, book_id, book_id_osis, book_id_usfx,
    // book_order, chapters, name, name_short, testament, testament_order
    //^^ this is the data value titles.
    data.data.forEach((value, index, array) => {
        // console.log(value);
        // bible_names.push(value.name);
//  TODO: based on this selection, create values for the next selection... so would that mean...
// TODO:thinking about getting rid of function doDisplayBibleBookChapters(data);
        //
        bible_book_options.insertAdjacentHTML('beforeend', `
        <option value="${value.book_id}">${value.name}</option>
`)
    });

}

//doDisplayBibleBookChapters uses doGiveMeEveryChapter to make option values based on chapters.
//doDisplayBibleBookChapters is called in doFetchInfoForBibleBooks()
function doDisplayBibleBookChapters(data) {
    let bible_book_chapter = document.querySelector('.bible_book_chapter');
    data.data.forEach((value, index, array) => {
        // console.log(`number of chapters : ${value.chapters.length}, name: ${value.name}, index: ${index}`);
        // console.log(value.chapters)
        // bible_names.push(value.name);
        let bookname = value.book_id;
        let everyChapter = doGiveMeEveryChapter(value, bookname);
        // console.log(everyChapter); //this is <option>chapters</option>
        bible_book_chapter.insertAdjacentHTML('beforeend', `
        ${everyChapter}
`)
    });
}


//doGiveMeEveryChapter make options for every chapter in the bible.
//doGiveMeEveryChapter is called in doDisplayBibleBookChapters(data)
function doGiveMeEveryChapter(value, bookname) {
    //this is in function doDisplayBibleBookChapters
    let text = '';
    for (let i = 0; i < value.chapters.length; i++) {
        text += `<option value="${value.chapters[i]}" class="${value.chapters.length} ${bookname}"> ${value.chapters[i]} </option>`
    }
    return text;
// console.log(value.chapters, index);

}


//doSearchOnClick uses doFetchInfoForBibleVerses(version, book, chapter, displayinformation)
//doSearchOnClick gets users values and puts them in a fetch request doFetchInfoForBibleVerses
//doSearchOnClick is called in doCallAllFunctions();
function doSearchOnClick() {
    let search_bible_button = document.getElementById('doSearchOnClick');
    let display_search_info = document.querySelector('.doDisplayChapterHere');
    let bible_version = document.querySelector('#bible_version');
    let bible_book = document.querySelector('#bible_book');
    let bible_chapter = document.querySelector('#bible_chapter');

    search_bible_button.addEventListener('click', (event) => {
        event.preventDefault();
        let version = bible_version.value;
        let book = bible_book.value;
        let chapter = bible_chapter.value;
        doFetchInfoForBibleVerses(version, book, chapter, display_search_info);
    });
}


//thinking of using a function that displays classes,
//to get class names and display option values
// i.e. Genesis only display GES class (1-50), PSA Psalm 1-150, PHM Philemon 1
//based on class name... but maybe another way to go about this?
// maybe to be created once a user selects a book? or enabled... (in progress)
function doDisplaySelectClassValue() {
/**/
}

//display book value
//display chapter
// the chapter option values to be the value of the books verse length
// but to make an array up to that length?
// function doShowChaptersBasedOnBookValue(){
//     let bible_book_value = document.querySelector('.bible_book_options').value;
//     let bible_book_chapter = document.querySelector('.bible_book_chapter').value;
//     console.log(bible_book_value, bible_book_chapter);
//
// console.log()
// }


    //setting the value once chapter is selected...
    //function myFunction(e) {
    //     document.getElementById("myText").value = e.target.value
    // }

//doCallAllFunctions() is just a place to call all functions.
function doCallAllFunctions() {
    doFetchInfoForBibleBooks();
//    doSearchOnClick(): // connected to:
//    function doFetchInfoForBibleVerses(version, book, chapter, displayinformation);
    doSearchOnClick();
}

doCallAllFunctions();

})();