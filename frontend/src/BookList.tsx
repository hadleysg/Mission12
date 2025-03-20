import { useEffect, useState } from 'react';
import { Book } from './Book';
import 'bootstrap/dist/css/bootstrap.min.css';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch('http://localhost:5002/api/Books');
      const data = await response.json();
      setBooks(data);
    };

    fetchBooks();
  }, []);

  // Sorting by Title
  const sortBooks = () => {
    setBooks(
      [...books].sort((a, b) =>
        sortAscending
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      )
    );
    setSortAscending(!sortAscending);
  };

  // Pagination Logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center text-center">
      <h1 className="fw-bold display-4 mb-3">Online Bookstore</h1>

      <button
        className="btn text-white my-3"
        style={{ backgroundColor: '#6c7b95' }}
        onClick={sortBooks}
      >
        Sort by Title {sortAscending ? '↑' : '↓'}
      </button>

      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>ISBN</th>
              <th>Category</th>
              <th>Pages</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book) => (
              <tr key={book.bookID}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.category}</td>
                <td>{book.pageCount}</td>
                <td>${book.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3 w-50">
        <div>
          <label className="me-2">Books per page: </label>
          <select
            className="form-select w-auto d-inline-block"
            value={booksPerPage}
            onChange={(e) => setBooksPerPage(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>

        <div>
          {Array.from(
            { length: Math.ceil(books.length / booksPerPage) },
            (_, i) => (
              <button
                key={i}
                className="btn btn-secondary mx-1"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default BookList;
