"use strict";


//4/23/2022 -
// make a search function to display book value of one chapter in the bible.
//when you click on a book, make a selection tab of the books

// MAT
// (Required) Will filter the results by the given book.
// For a complete list see the book_id field in the /bibles/books route.
// const url = `https://4.dbt.io/api/bibles/filesets/ENGESV/MAT/5?verse_start=1&verse_end=48&v=4&key=${BIBLE_API}`;
//https://4.dbt.io/api/bibles/filesets/:fileset_id/:book/:chapter?verse_start=5&verse_end=5&v=4&key=
//the information input required from user to display info would be:
//fieldset_id (bible version - ENGESV/ ENGKJV/ ) value
//book (matthew - MAT) value book_id
//chapter (5...but it has to be related to book )
//verse start ... should it auto to 1?
//verse end ... should it just auto to where it ends?

//doFetchInfoForBibleBooks uses doDisplayBibleBookNames & doDisplayBibleBookChapters
function doFetchInfoForBibleBooks() {
    const url_books = `https://4.dbt.io/api/bibles/ENGESV/book?book_id&v=4&key=`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    fetch(url_books + BIBLE_API, options).then(function (response) {
        return response.json();
    }).then(function (data) {
        // console.log(data);
        doDisplayBibleBookNames(data);
        doDisplayBibleBookChapters(data);
    }).catch(function (jqXhr, status, error) {
        console.log(jqXhr);
        console.log(status);
        console.log(error);
    });
}

function doFetchInfoForBibleVerses() {

    //https://4.dbt.io/api/bibles/filesets/:fileset_id/:book/:chapter?verse_start=5&verse_end=5&v=4&key=
const url = `https://4.dbt.io/api/bibles/filesets/ENGESV/MAT/5?verse_start=1&verse_end=48&v=4&key=${BIBLE_API}`;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }

fetch(url, options).then(function (response) {
    return response.json();
}).then(function (data) {
    // console.log(data);
    data.data.forEach((value, index)=>{
        // console.log(value); // book of matthew verses...
        // postDataToScreen(value);
    });
}).catch(function (jqXhr, status, error) {
    console.log(jqXhr);
    console.log(status);
    console.log(error);
});
    //https://4.dbt.io/api/bibles/filesets/:fileset_id/:book/:chapter?verse_start=5&verse_end=5&v=4&key=
}

function doDisplayBibleBookNames(data) {
    let bible_book_options = document.querySelector('.bible_book_options');
    //book_group, book_id, book_id_osis, book_id_usfx, book_order, chapters, name, name_short, testament, testament_order

    data.data.forEach((value, index, array) => {
        // console.log(value);
        // bible_names.push(value.name);
        bible_book_options.insertAdjacentHTML('beforeend', `
        <option value="${value.book_id}">${value.name}</option>
`)
    });
}

function doDisplayBibleBookChapters(data) {
    let bible_book_chapter = document.querySelector('.bible_book_chapter');
    data.data.forEach((value, index, array) => {
        // console.log(index);
        //make a function that appears based on the index...
        console.log(` number of chapters : ${value.chapters.length}, name: ${value.name}, index: ${index}`);
        // console.log(value.chapters)
        // bible_names.push(value.name);
        bible_book_chapter.insertAdjacentHTML('beforeend', `
        <option value="${index + 1}">${value.chapters.join('\n')}</option>
`)
    });
}

//search function
function doSearchOnClick(){
    let search_bible_button = document.getElementById('doSearchOnClick');
    let display_search_info = document.querySelector('.doDisplayChapterHere');
    search_bible_button.addEventListener('click' , (e)=>{
        e.preventDefault();
        //CLEARS - noREPEATS
        display_search_info.innerText = '';
        display_search_info.insertAdjacentHTML('beforeend', `this will display the verse.`)
        console.log('ive been clicked.');
    });
}

function doCallAllFunctions() {
    doFetchInfoForBibleBooks();
    // doFetchInfoForBibleVerses();

//    search function:
    doSearchOnClick();
}

doCallAllFunctions();

