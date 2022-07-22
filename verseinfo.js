"use strict";

//create an element and add a class 'the-bible-information' to it,
//which will post data.
function postDataToScreen(data){
    let postInfo = document.querySelector('.the-bible-information');
    postInfo.insertAdjacentHTML('beforeend', `
${data.book_name} <br>
${data.verse_text}
`)
}


//https://documenter.getpostman.com/view/12519377/Tz5p6dp7#69d1a7a4-81c4-49e1-b04e-d8e7fa8bdec5
//PARAMS
// verse_start:
// Will filter the results by the given starting verse
// verse_end:
// Will filter the results by the given ending verse
// v: 4 (Required) The Version Number
// PATH VARIABLES:
// fileset_id
// ENGESV
// (Required) The fileset ID
// book
// MAT (Required) Will filter the results by the given book. For a complete list see the book_id field in the /bibles/books route.
//
// chapter
// 4
// (Required) Will filter the results by the given chapter
//URL: https://4.dbt.io/api/bibles/filesets/:fileset_id/:book/:chapter?verse_start=5&verse_end=5&v=4&key=
const url = `https://4.dbt.io/api/bibles/filesets/ENGESV/MAT/5?verse_start=1&verse_end=48&v=4&key=` + BIBLE_API_KEY;
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
};

fetch(url, options).then(function (response) {
    return response.json();
}).then(function (data) {
    console.log(data);
    data.data.forEach((value, index)=>{
        console.log(value);
        postDataToScreen(value);
    });
}).catch(function (jqXhr, status, error) {
    console.log(jqXhr);
    console.log(status);
    console.log(error);
});