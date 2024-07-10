import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import BookList from '../components/BookList';
import BookForm from '../components/BookForm';
import { getBooks } from '../services/api';
import useSWR from 'swr';

const Home: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [genres, setGenres] = useState<any>([]);
    const { mutate } = useSWR('/books');

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await getBooks();
            const uniqueGenres = Array.from(new Set(response.data.map((book: any) => book.genre)));
            setGenres(uniqueGenres);
        };
        fetchBooks();
    }, []);

    const handleFormSuccess = () => {
        setShowForm(false);
        mutate();
    };

    return (
        <Container>
            <Typography margin={'10px'} variant="h4" gutterBottom align="center">
                Rares's Library Manager
            </Typography>
            <BookList />
            <Box display="flex" justifyContent="flex-end" marginTop={2}>
                <Button variant="contained" color="primary" onClick={() => setShowForm(true)}>
                    Add New Book
                </Button>
            </Box>
            <Dialog open={showForm} onClose={() => setShowForm(false)} fullWidth>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogContent>
                    <BookForm
                        initialValues={{ title: '', author: '', genre: '', description: '' }}
                        onSubmitSuccess={handleFormSuccess}
                        genres={genres}
                        mutate={mutate}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowForm(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Home;
