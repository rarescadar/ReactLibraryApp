const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// This will store our books in memory,
// "id" is the unique identifier,
// other fields are up to you
let books = [
  { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", description: "A novel about racial injustice in the Deep South." },
  { id: 2, title: "1984", author: "George Orwell", genre: "Dystopian", description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism." },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", description: "A novel about the American dream and the roaring twenties." },
  { id: 4, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", description: "A romantic novel that charts the emotional development of the protagonist, Elizabeth Bennet." },
  { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Fiction", description: "A story about adolescent Holden Caulfield's disillusionment with the adult world." },
  { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", description: "A fantasy novel and children's book that serves as a prequel to The Lord of the Rings." },
  { id: 7, title: "Moby-Dick", author: "Herman Melville", genre: "Adventure", description: "A novel about Captain Ahab's obsessive quest to kill the giant white whale Moby Dick." },
  { id: 8, title: "War and Peace", author: "Leo Tolstoy", genre: "Historical", description: "A historical novel that chronicles the French invasion of Russia." },
  { id: 9, title: "Jane Eyre", author: "Charlotte Brontë", genre: "Romance", description: "A novel that follows the experiences of the orphaned protagonist, Jane Eyre." },
  { id: 10, title: "The Lord of the Rings", author: "J.R.R. Tolkien", genre: "Fantasy", description: "An epic high-fantasy novel that follows the quest to destroy the One Ring." }
];

// Get all books
app.get("/books", (req, res) => {
  res.json(books);
});

// Add a new book
app.post("/books", (req, res) => {
  const book = { id: Date.now(), ...req.body };
  books.push(book);
  res.status(201).json(book);
});

// Update a book
app.put("/books/:id", (req, res) => {
  const index = books.findIndex((book) => book.id === parseInt(req.params.id));
  if (index >= 0) {
    books[index] = { ...books[index], ...req.body };
    res.json(books[index]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book
app.delete("/books/:id", (req, res) => {
  books = books.filter((book) => book.id !== parseInt(req.params.id));
  res.status(204).send();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
