const app = require('express')()
const FFirebase = require('foguete-buttons')
const db = new FFirebase({ url: 'firebase-url' })

app.post('/api/firebase/write', (req, res) => {
  const path = req.query.path
  const body = JSON.stringify(req.query.body)
  db.writeData(path, body)
})

app.listen(8080) 
