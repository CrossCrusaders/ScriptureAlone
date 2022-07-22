"use strict";

// MAT
// (Required) Will filter the results by the given book.
// For a complete list see the book_id field in the /bibles/books route.

// const url = `https://4.dbt.io/api/bibles/filesets/ENGESV/MAT/5?verse_start=1&verse_end=48&v=4&key=${BIBLE_API}`;

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
        doGetBibleBookNames(data);
    }).catch(function (jqXhr, status, error) {
        console.log(jqXhr);
        console.log(status);
        console.log(error);
    });
}

function doGetBibleBookNames(data) {
    let bible_book_options = document.querySelector('.bible_book_options');
    //book_group, book_id, book_id_osis, book_id_usfx, book_order, chapters, name, name_short, testament, testament_order

    data.data.forEach((value, index, array) => {
        // console.log(value);
        // bible_names.push(value.name);
        bible_book_options.insertAdjacentHTML('beforeend', `
        <option value="${value.name}">${value.name}</option>
        <option value="${value.book_id}">${value.chapters}</option>

`)
    });
}

function callAllFunctions() {
    doFetchInfoForBibleBooks();
}

callAllFunctions();

function doFetchInfoForBibleVerses(){
    //https://4.dbt.io/api/bibles/filesets/:fileset_id/:book/:chapter?verse_start=5&verse_end=5&v=4&key=


// fetch(url, options).then(function (response) {
//     return response.json();
// }).then(function (data) {
//     console.log(data);
//     data.data.forEach((value, index)=>{
//         console.log(value);
//         // postDataToScreen(value);
//     });
// }).catch(function (jqXhr, status, error) {
//     console.log(jqXhr);
//     console.log(status);
//     console.log(error);
// });
    //https://4.dbt.io/api/bibles/filesets/:fileset_id/:book/:chapter?verse_start=5&verse_end=5&v=4&key=
// const url = `https://4.dbt.io/api/bibles/filesets/ENGESV/MAT/5?verse_start=1&verse_end=48&v=4&key=${BIBLE_API}`;
}
