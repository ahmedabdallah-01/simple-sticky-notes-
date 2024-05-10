
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

mongoose.connect('mongodb://localhost:27017/notesDB')
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });


const noteSchema = new mongoose.Schema({
  content: String
});
const Note = mongoose.model('Note', noteSchema);


app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.render('index');
});


app.post('/add', async (req, res) => {
  try {
    const noteContent = req.body.content;
    const newNote = new Note({
      content: noteContent
    });
    await newNote.save();
    console.log('Note added successfully');
    res.redirect('/notes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding note');
  }
});


app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find({});
    res.render('notes', { notes: notes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching notes');
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
