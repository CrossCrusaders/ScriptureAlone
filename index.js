const app = require('express')()
//const FFirebase = require('foguete-buttons')
//const db = new FFirebase({ url: 'firebase-url' })

//app.post('/api/firebase/write', (req, res) => {
//  const path = req.query.path
//  const body = JSON.stringify(req.query.body)
//  db.writeData(path, body)
//})

//app.listen(8080) 

// functionality to copy text from inviteCode to clipboard

// trigger copy event on click
//$('#copy').on('click', function(event) {
//  console.log(event);
//  copyToClipboard(event);
//});

// event handler
//function copyToClipboard(e) {
  // alert('this function was triggered');
  // find target element
//  var
//    t = e.target, 
//    c = t.dataset.copytarget,
//    inp = (c ? document.querySelector(c) : null);
//  console.log(inp);
//  // check if input element exist and if it's selectable
//  if (inp && inp.select) {
//    // select text
//    inp.select();
//    try {
//      // copy text
//      document.execCommand('copy');
//      inp.blur();
//
//      // copied animation
//      t.classList.add('copied');
//      setTimeout(function() {
//        t.classList.remove('copied');
//      }, 1500);
//    } catch (err) {
//      //fallback in case exexCommand doesnt work
//      alert('please press Ctrl/Cmd+C to copy');
//    }
//
//  }
//
//}