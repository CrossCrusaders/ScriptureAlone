//https://dev.api.scripturealone.app/api/bibles/books?bible_id=de4e12af7f28f599-02


import fs from 'fs'
import fetch from 'node-fetch'

// https://dev.api.scripturealone.app/api/bible-brain/bibles/ENGKJV?v=4
// response.data.books
async function run() {
  const response = await fetch('https://dev.api.scripturealone.app/api/bible-brain/bibles/ENGKJV?v=4')
  const result = await response.json()
  const { books } = result.data

  /**
[{
  bookId: 'JHN',
  name: 'John',
  nameShort: 'John',
  chapterNumber: 1,
  sequenceNumber: $index
}]
   */
  const bibleMetaArray = []

  let sequence = 0
  books.forEach(book => {

    const { book_id, chapters, name, name_short, testment } = book

    chapters.forEach(chapter => {

      bibleMetaArray.push({
        bookId: book_id,
        name: name,
        nameShort: name_short,
        chapterNumber: chapter,
        sequenceNumber: sequence++,
        testment
      })
    })

  })

  fs.writeFileSync('./bible-books.json', JSON.stringify(bibleMetaArray))
  
}



run()