"use strict";
const app = Vue.createApp({
    data() {
        return {
            product : 'testingThis'
        }
    }
});

// this.responseAvailable = false;
//
// fetch("", {
//     "method": "GET",
//     "headers": {
//
//     }
// })
//     .then(response => {
//         if(response.ok){
//             return response.json()
//         } else{
//             alert("Server returned " + response.status + " : " + response.statusText);
//         }
//     })
//     .then(response => {
//         this.result = response.body;
//         this.responseAvailable = true;
//     })
//     .catch(err => {
//         console.log(err);
//     });