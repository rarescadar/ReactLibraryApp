import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, MenuItem } from '@mui/material';
import { addBook, updateBook } from '../services/api';

interface BookFormProps {
    initialValues: any;
    onSubmitSuccess: () => void;
    bookId?: number;
    genres: string[];
    mutate: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ initialValues, onSubmitSuccess, bookId, genres }) => {
    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object({
            title: Yup.string()
                .min(5, 'Title must be at least 5 characters')
                .required('Title is required'),
            author: Yup.string()
                .min(5, 'Author must be at least 5 characters')
                .required('Author is required'),
            genre: Yup.string().required('Genre is required'),
            description: Yup.string(),
        }),
        onSubmit: async (values) => {
            try {
                if (bookId) {
                    await updateBook(bookId, values);
                } else {
                    await addBook(values);
                }
                onSubmitSuccess();
            } catch (error) {
                console.error(error);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <TextField
                fullWidth
                margin="normal"
                label="Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && typeof formik.errors.title === 'string' ? formik.errors.title : ''}
            />
            <TextField
                fullWidth
                margin="normal"
                label="Author"
                name="author"
                value={formik.values.author}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.author && Boolean(formik.errors.author)}
                helperText={formik.touched.author && typeof formik.errors.author === 'string' ? formik.errors.author : ''}
            />
            <TextField
                fullWidth
                margin="normal"
                select
                label="Genre"
                name="genre"
                value={formik.values.genre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.genre && Boolean(formik.errors.genre)}
                helperText={formik.touched.genre && typeof formik.errors.genre === 'string' ? formik.errors.genre : ''}
            >
                {genres.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                        {genre}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                fullWidth
                margin="normal"
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && typeof formik.errors.description === 'string' ? formik.errors.description : ''}
            />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
                Submit
            </Button>
        </form>
    );
};

export default BookForm;
