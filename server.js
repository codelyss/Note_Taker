const fs = require('fs');
const path = require('path');
const express = require('express');
const {notes} = require('./db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  console.log(notesArray);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

app.get('/api/notes', (req, res) => {
    let results = notes;
    res.json(results);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.post('/api/notes', (req, res) => {
   req.body.id = notes.length + 1;
   const note = createNewNote(req.body, notes);
   res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
   var notesArray = notes;
   for(var i = notesArray.length - 1; i >= 0; i--) {
    if(notesArray[i].id == req.params.id) {
      notesArray.splice(i, 1);
     }
   }
   fs.writeFileSync(
     path.join(__dirname, './db/db.json'),
     JSON.stringify({ notes: notesArray }, null, 2)
   );
   res.json(notes);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
