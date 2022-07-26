"use strict";
(function () {

// MAT
// (Required) Will filter the results by the given book.
// For a complete list see the book_id field in the /bibles/books route.
//https://4.dbt.io/api/bibles/filesets/:fileset_id/:book/:chapter?verse_start=5&verse_end=5&v=4&key=
//the information input required from user to display info would be:
//:fileset_id (bible version - ENGESV/ ENGKJV/ ) value
//:book (matthew - MAT) value book_id
//:chapter (5...but it has to be related to book value  )
//verse_start= ... should it auto to 1?
//verse_end= ... should it just auto to where it ends?
//key=

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
            // doDisplayBibleBookChapters(data);
            doChangeChapterBasedOnBook(data);
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
            bible_book_options.insertAdjacentHTML('beforeend', `
        <option value="${value.book_id}">${value.name}</option>
`)
        });

    }

    //using jQuery, grabs the book selection and makes the chapter selections based on bookvalue.
    //is called in doFetchInfoForBibleBooks();
    function doChangeChapterBasedOnBook(data) {
        // let bookid = (data) => {data.data.forEach((data)=>{console.log(data.book_id)})}
        // console.log(bookid(data));
        $(".bible_book_options").change(function () {
            let book_value = document.querySelector('.bible_book_options').value;
            let chapter_options = document.querySelector('.bible_chapter');
            //if using switch case, to save retyping, making function variables.
            //empty the options to avoid repeats
            let empty_options = () => chapter_options.innerHTML = "";
            //get the array of chapters based on the index, make option for every chapter.
            let doGetChaptersFromIndex = (index) => data.data[index].chapters.forEach((chapterList) => {
                let chapter = '';
                chapter += `<option value="${chapterList}">${chapterList}</option>`
                return option_elements(chapter);
            });
            //insert option elements for every chapter
            let option_elements = (chapter) => {
                chapter_options.insertAdjacentHTML('beforeend', `
        ${chapter}`);
            }

//for now, manually inputing every book_value case... needs to be refactored...
            switch (book_value) {
                case 'GEN':
                    console.log(`${book_value}`);
                    empty_options();
                    doGetChaptersFromIndex(0);
                    // option_elements(`${book_value}`);
                    break;
                case 'EXO':
                    empty_options();
                    doGetChaptersFromIndex(1);
                    break;
                case 'LEV':
                    empty_options();
                    doGetChaptersFromIndex(2);
                    break;
                case 'NUM':
                    empty_options();
                    doGetChaptersFromIndex(3);
                    break;
                case 'DEU':
                    empty_options();
                    doGetChaptersFromIndex(4);
                    break;
                case 'JOS':
                    empty_options();
                    doGetChaptersFromIndex(5);
                    break;
                case 'JDG':
                    empty_options();
                    doGetChaptersFromIndex(6);
                    break;
                case 'RUT':
                    empty_options();
                    doGetChaptersFromIndex(7);
                    break;
                case '1SA':
                    empty_options();
                    doGetChaptersFromIndex(8);
                    break;
                case '2SA':
                    empty_options();
                    doGetChaptersFromIndex(9);
                    break;
                case '1KI':
                    empty_options();
                    doGetChaptersFromIndex(10);
                    break;
                case '2KI':
                    empty_options();
                    doGetChaptersFromIndex(11);
                    break;
                case '1CH':
                    empty_options();
                    doGetChaptersFromIndex(12);
                    break;
                case '2CH':
                    empty_options();
                    doGetChaptersFromIndex(13);
                    break;
                case 'EZR':
                    empty_options();
                    doGetChaptersFromIndex(14);
                    break;
                case 'NEH':
                    empty_options();
                    doGetChaptersFromIndex(15);
                    break;
                case 'EST':
                    empty_options();
                    doGetChaptersFromIndex(16);
                    break;
                case 'JOB':
                    empty_options();
                    doGetChaptersFromIndex(17);
                    break;
                case 'PSA':
                    empty_options();
                    doGetChaptersFromIndex(18);
                    break;
                case 'PRO':
                    empty_options();
                    doGetChaptersFromIndex(19);
                    break;
                case 'ECC':
                    empty_options();
                    doGetChaptersFromIndex(20);
                    break;
                case 'SNG':
                    empty_options();
                    doGetChaptersFromIndex(21);
                    break;
                case 'ISA':
                    empty_options();
                    doGetChaptersFromIndex(22);
                    break;
                case 'JER':
                    empty_options();
                    doGetChaptersFromIndex(23);
                    break;
                case 'LAM':
                    empty_options();
                    doGetChaptersFromIndex(24);
                    break;
                case 'EZK':
                    empty_options();
                    doGetChaptersFromIndex(25);
                    break;
                case 'DAN':
                    empty_options();
                    doGetChaptersFromIndex(26);
                    break;
                case 'HOS':
                    empty_options();
                    doGetChaptersFromIndex(27);
                    break;
                case 'JOL':
                    empty_options();
                    doGetChaptersFromIndex(28);
                    break;
                case 'AMO':
                    empty_options();
                    doGetChaptersFromIndex(29);
                    break;
                case 'OBA':
                    empty_options();
                    doGetChaptersFromIndex(30);
                    break;
                case 'JON':
                    empty_options();
                    doGetChaptersFromIndex(31);
                    break;
                case 'MIC':
                    empty_options();
                    doGetChaptersFromIndex(32);
                    break;
                case 'NAM':
                    empty_options();
                    doGetChaptersFromIndex(33);
                    break;
                case 'HAB':
                    empty_options();
                    doGetChaptersFromIndex(34);
                    break;
                case 'ZEP':
                    empty_options();
                    doGetChaptersFromIndex(35);
                    break;
                case 'HAG':
                    empty_options();
                    doGetChaptersFromIndex(36);
                    break;
                case 'ZEC':
                    empty_options();
                    doGetChaptersFromIndex(37);
                    break;
                case 'MAL':
                    empty_options();
                    doGetChaptersFromIndex(38);
                    break;
                case 'MAT':
                    empty_options();
                    doGetChaptersFromIndex(39);
                    break;
                case 'MRK':
                    empty_options();
                    doGetChaptersFromIndex(40);
                    break;
                case 'LUK':
                    empty_options();
                    doGetChaptersFromIndex(41);
                    break;
                case 'JHN':
                    empty_options();
                    doGetChaptersFromIndex(42);
                    break;
                case 'ACT':
                    empty_options();
                    doGetChaptersFromIndex(43);
                    break;
                case 'ROM':
                    empty_options();
                    doGetChaptersFromIndex(44);
                    break;
                case '1CO':
                    empty_options();
                    doGetChaptersFromIndex(45);
                    break;
                case '2CO':
                    empty_options();
                    doGetChaptersFromIndex(46);
                    break;
                case 'GAL':
                    empty_options();
                    doGetChaptersFromIndex(47);
                    break;
                case 'EPH':
                    empty_options();
                    doGetChaptersFromIndex(48);
                    break;
                case 'PHP':
                    empty_options();
                    doGetChaptersFromIndex(49);
                    break;
                case 'COL':
                    empty_options();
                    doGetChaptersFromIndex(50);
                    break;
                case '1TH':
                    empty_options();
                    doGetChaptersFromIndex(51);
                    break;
                case '2TH':
                    empty_options();
                    doGetChaptersFromIndex(52);
                    break;
                case '1TI':
                    empty_options();
                    doGetChaptersFromIndex(53);
                    break;
                case '2TI':
                    empty_options();
                    doGetChaptersFromIndex(54);
                    break;
                case 'TIT':
                    empty_options();
                    doGetChaptersFromIndex(55);
                    break;
                case 'PHM':
                    empty_options();
                    doGetChaptersFromIndex(56);
                    break;
                case 'HEB':
                    empty_options();
                    doGetChaptersFromIndex(57);
                    break;
                case 'JAS':
                    empty_options();
                    doGetChaptersFromIndex(58);
                    break;
                case '1PE':
                    empty_options();
                    doGetChaptersFromIndex(59);
                    break;
                case '2PE':
                    empty_options();
                    doGetChaptersFromIndex(60);
                    break;
                case '1JN':
                    empty_options();
                    doGetChaptersFromIndex(61);
                    break;
                case '2JN':
                    empty_options();
                    doGetChaptersFromIndex(62);
                    break;
                case '3JN':
                    empty_options();
                    doGetChaptersFromIndex(63);
                    break;
                case 'JUD':
                    empty_options();
                    doGetChaptersFromIndex(64);
                    break;
                case 'REV':
                    empty_options();
                    doGetChaptersFromIndex(65);
                    break;
                default :
                    doGetChaptersFromIndex(0);
                    break;

            }

        });
        console.log("ready!");
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


//doCallAllFunctions() is just a place to call all functions.
    function doCallAllFunctions() {


        doFetchInfoForBibleBooks();
//    doSearchOnClick(): // connected to:
//    function doFetchInfoForBibleVerses(version, book, chapter, displayinformation);
//    doChangeChapterBasedOnBook(); (is called in doCallAllFunctions();)
        doSearchOnClick();
    }

    doCallAllFunctions();

})();

//TODO: make option values default to 1-50 on page load. & refactor switch case...