import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001', // Mock server base URL
});

export const getBooks = () => api.get('/books');
export const addBook = (book: any) => api.post('/books', book);
export const updateBook = (id: number, book: any) => api.put(`/books/${id}`, book);
export const deleteBook = (id: number) => api.delete(`/books/${id}`);
