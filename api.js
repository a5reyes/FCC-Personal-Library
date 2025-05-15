'use strict';

module.exports = function (app) {
  const mongoose = require('mongoose');
  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
  const Schema = mongoose.Schema;
  const BookSchema = new Schema({
    title: { type: String, required: true },
    commentcount: Number,
    comments: [String]
  });
  const Book = mongoose.model("Book", BookSchema);
  
  app.route('/api/books')
    .get(async(req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await Book.find();
      const response = books.map(book => ({
        _id: book._id,
        title: book.title,
        commentcount: book.commentcount || 0
      }));
      res.json(response);
    })
    
    .post(async(req, res) => {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title){
        res.send("missing required field title");
      } else {
        const book = new Book({
          title: title,
          commentcount: 0,
          comments: []
        });
        const newBook = await book.save();
        res.json({
          _id: newBook._id,
          title: newBook.title,
          commentcount: newBook.commentcount
        });
      }
    })
    
    .delete(async(req, res) => {
      //if successful response will be 'complete delete successful'
      const deleteBooks = await Book.deleteMany({});
      if (!deleteBooks){
        res.send("error");
      } else {
        res.send("complete delete successful");
      }
    });



  app.route('/api/books/:id')
    .get(async(req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const foundBook = await Book.findById(bookid);
      if (!foundBook){
        res.send("no book exists");
      } else {
        res.json(foundBook);
      }
    })
    
    .post(async(req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment){
        res.send("missing required field comment");
      } else {
        const foundBook = await Book.findByIdAndUpdate(bookid, { '$push': { comments: comment }}, { new: true });
        if (!foundBook){
          res.send("no book exists");
        } else {
          res.json(foundBook)
        }
      }
    })
    
    .delete(async(req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      const deletedBook = await Book.findByIdAndDelete(bookid)
      if (!deletedBook){
        res.send("no book exists");
      } else {
        res.send("delete successful");
      }
    });
  
};
