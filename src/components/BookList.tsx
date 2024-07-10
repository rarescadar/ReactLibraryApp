import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { getBooks, deleteBook } from '../services/api';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    TextField,
    MenuItem,
    Box,
    TablePagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BookForm from './BookForm';

const fetcher = () => getBooks().then(res => res.data);

const BookList: React.FC = () => {
    const { data, error, mutate } = useSWR('/books', fetcher);
    const [editBook, setEditBook] = useState<any>(null);
    const [deleteBookId, setDeleteBookId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [genreFilter, setGenreFilter] = useState<string>('');
    const [genres, setGenres] = useState<any>([]);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);

    useEffect(() => {
        if (data) {
            const uniqueGenres = Array.from(new Set(data.map((book: any) => book.genre)));
            setGenres(uniqueGenres);
        }
    }, [data]);

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    const handleDelete = async (id: number) => {
        await deleteBook(id);
        mutate(); // Refresh data
        setDeleteBookId(null); // Close the confirmation dialog
    };

    const handleEdit = (book: any) => {
        setEditBook(book);
    };

    const handleEditSuccess = () => {
        setEditBook(null);
        mutate(); // Refresh data
    };

    const filteredBooks = data.filter((book: any) => {
        return (
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (genreFilter === '' || book.genre === genreFilter)
        );
    });

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedBooks = filteredBooks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" justifyContent="space-between" width="100%" mb={2}>
                <TextField
                    fullWidth
                    label="Search by title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    margin="normal"
                    style={{ marginRight: '8px' }}
                />
                <TextField
                    fullWidth
                    select
                    label="Filter by genre"
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    margin="normal"
                >
                    <MenuItem value="">
                        <em>All</em>
                    </MenuItem>
                    {genres.map((genre: any) => (
                        <MenuItem key={genre} value={genre}>
                            {genre}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
            <TableContainer component={Paper} style={{ maxWidth: '100%' }}>
                <Table>
                    <TableHead className="bg-headerBg text-white">
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Genre</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedBooks.map((book: any) => (
                            <TableRow key={book.id} className="bg-rowBg">
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{book.genre}</TableCell>
                                <TableCell>{book.description}</TableCell>
                                <TableCell>
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(book)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => setDeleteBookId(book.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredBooks.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <Dialog open={!!editBook} onClose={() => setEditBook(null)} fullWidth>
                <DialogTitle>Edit Book</DialogTitle>
                <DialogContent>
                    <BookForm
                        initialValues={editBook || { title: '', author: '', genre: '', description: '' }}
                        onSubmitSuccess={handleEditSuccess}
                        bookId={editBook?.id}
                        genres={genres}
                        mutate={mutate}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditBook(null)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteBookId !== null} onClose={() => setDeleteBookId(null)} fullWidth>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this book?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteBookId(null)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleDelete(deleteBookId!)} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BookList;
