//https://dev.api.scripturealone.app/api/bibles/books?bible_id=de4e12af7f28f599-02


import fs from 'fs'
import fetch from 'node-fetch'


async function run() {
  const response = await fetch('https://dev.api.scripturealone.app/api/bibles/books?bible_id=de4e12af7f28f599-02')
  const result = await response.json()
  const data = result.data

  const books = []
  const chapters = {}

  data.forEach(item => {

    books.push({
      id: item.id,
      abbreviation: item.abbreviation,
      name: item.name,
      nameLong: item.nameLong,
    })

    chapters[item.id] = []

    item.chapters.filter(i => i.number !== 'intro').forEach(chapter => {

      chapters[item.id].push({
        "id": chapter.id,
        "bookId": chapter.bookId,
        "number": chapter.number,
        "position": chapter.position
      })
    })

  })

  fs.writeFileSync('./books.json', JSON.stringify(books))
  fs.writeFileSync('./chapters.json', JSON.stringify(chapters))
}



run()