//https://dev.api.scripturealone.app/api/bibles/books?bible_id=de4e12af7f28f599-02


import fs from 'fs'
import fetch from 'node-fetch'
import promptSync from 'prompt-sync'

const prompt = promptSync()

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
  const bibleBooksTracker = {}
  const bibleBooksArray = []

  let sequence = 0
  books.forEach(book => {

    const { book_id, chapters, name, name_short, testment } = book

    const searchTerms = prompt(`Search Terms for ${name}: `)
    const searchTokens = searchTerms.split(',').filter(term => !!term)
    bibleBooksArray.push({
      bookId: book_id,
      name: name,
      searchTerms: searchTokens
    })
  })

  console.log(bibleBooksArray)

  fs.writeFileSync('./bible-book-lookup.json', JSON.stringify(bibleBooksArray))
}



run()