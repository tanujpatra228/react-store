import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import { TextField, Container, Box, Typography, IconButton, Badge, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const ProductForm = () => {
    const auth = useSelector(store => store.auth.currUser);
    const navigate = useNavigate();
    const productImageField = useRef();
    const { productId } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [productImageSrc, setProductImageSrc] = useState('');

    const addProduct = (values) => {
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('mrp', values.mrp);
        formData.append('selling', values.selling);
        values.image && formData.append('image', values.image);

        axios.post(`${process.env.REACT_APP_API_ROOT}/products`, formData, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
        }).then((res) => {
            if (res.data.status) {
                toast.success(`${res.data.message.trim()}`);
            } else {
                toast.error(`${res.data.message.trim()}`);
            }
            setIsSubmitting(false);
        }).catch((error) => {
            toast.error(`Something went wrong! ${error.message}`);
            console.log('error', error);
            setIsSubmitting(false);
        });
    }

    const setProductData = (details = null) => {
        if(details !== null){
            formik.setFieldValue('name', details.name);
            formik.setFieldValue('description', details.description);
            formik.setFieldValue('mrp', details.mrp);
            formik.setFieldValue('selling', details.selling);

            // Product image
            let imgSrc = (details?.image) ? `${details.img}` : 'https://via.placeholder.com/300';
            setProductImageSrc(imgSrc);
        }
    }

    const getProductData = () => {
        if (productId === null) {return;}
        axios.get(`${process.env.REACT_APP_API_ROOT}/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
        }).then((res)=>{
            if (res.data.status) {
                setProductData(res.data.data);
            } else {
                toast.error(`Something went wrong!`);
            }
        }).catch((error) => {
            toast.error(`Something went wrong! ${error.message}`);
            console.log('error', error);
        });
    }

    const updateProduct = (values) => {
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('mrp', values.mrp);
        formData.append('selling', values.selling);
        formData.append('image', values.image);
        formData.append('_method', 'PUT');

        axios.post(`${process.env.REACT_APP_API_ROOT}/products/${productId}`, formData, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
          }).then(res => {
            if (res.data.status) {
                getProductData();
                toast.success(`${res.data.message.trim()}`);
            } else {
                toast.error(`${res.data.message.trim()}`);
            }
            setIsSubmitting(false);
        }).catch(error => {
            toast.error(`Something went wrong! ${error.message}`);
            console.log('error', error);
            setIsSubmitting(false);
        });
    }

    const handleSubmit = (values) => {
        if (!productId) {
            addProduct(values);
        } else {
            updateProduct(values);
        }
    }

    const formik = useFormik({
        // Initial values
        initialValues: {
            name: '',
            description: '',
            mrp: 0,
            selling: 0,
            image: ''
        },

        // Validation
        validationSchema: Yup.object({
            name: Yup.string().required("Please enter product Title"),
            description: Yup.string().required("Please enter description"),
            mrp: Yup.number().positive("MRP must be a positive number").required("Please add MRP"),
            selling: Yup.number().positive("Selling price must be a positive number").required("Please add Selling Price"),
            image: Yup.mixed().required("Please add product image"),
        }),

        // On Submit
        onSubmit: (values) => {
            handleSubmit(values);
        }
    });

    const setImagePreview = () => {
        const file = formik.values.image || null;
        if (file) {
            const reader = new FileReader();
            reader.onload = function(){
                setProductImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    useEffect(() => {
        getProductData();
    }, [auth, navigate]);

    useEffect(()=>{
        setImagePreview();   // set image preview
    }, [setImagePreview, formik.values.image]);

    return(
        <Container component="div" maxWidth="md">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5" sx={{mb: 2}}>
                    Add New Product
                </Typography>
                <IconButton
                    onClick={() => productImageField.current.click()}
                    sx={{ p: 0 }}
                >
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <CameraAltIcon sx={{backgroundColor: '#fff', borderRadius: 50, p: 0.5}} />
                        }
                    >
                        <img
                            src={productImageSrc}
                            className={`w-80 min-h-[300px] mb-5 rounded-lg ${(formik.touched.image && formik.errors.image) ? 'border border-red-500' : '' }`}
                            alr={formik.values.name || ''}
                            onError={(e) => e.target.src='https://via.placeholder.com/300'}
                        />
                    </Badge>
                </IconButton>

                { !productId && (<span className='text-red-500 text-xs'>{(formik.touched.image && formik.errors.image) ? `${formik.errors.image}` : ''}</span>) }
                { productId && (<span className='text-red-500 text-xs'>{(formik.touched.image && formik.errors.image) ? `Re-select image: API does not support product update without image` : ''}</span>) }

                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                    {/* Image */}
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        style={{display: 'none'}}
                        id="image"
                        name="image"
                        ref={productImageField}
                        onChange={(e) => formik.setFieldValue('image', e.currentTarget.files[0])}
                    />

                    {/* Name */}
                    <TextField
                        id="name"
                        label="Product Name"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={Boolean(formik.touched.name && formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />

                    {/* Description */}
                    <TextField
                        id="description"
                        label="Description"
                        margin="normal"
                        fullWidth
                        multiline
                        rows={4} maxRows={4}
                        variant="outlined"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        error={Boolean(formik.touched.description && formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    />

                    {/* Pricing */}
                    <Stack spacing={2}>
                        {/* MRP */}
                        <TextField
                            type="number"
                            id="mrp"
                            margin="normal"
                            label="MRP"
                            variant="outlined"
                            value={formik.values.mrp}
                            onChange={formik.handleChange}
                            error={Boolean(formik.touched.mrp && formik.errors.mrp)}
                            helperText={formik.touched.mrp && formik.errors.mrp}
                        />

                        {/* Selling */}
                        <TextField
                            type="number"
                            id="selling"
                            margin="normal"
                            label="Selling"
                            variant="outlined"
                            value={formik.values.selling}
                            onChange={formik.handleChange}
                            error={Boolean(formik.touched.selling && formik.errors.selling)}
                            helperText={formik.touched.selling && formik.errors.selling}
                        />
                    </Stack>

                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        loading={isSubmitting}
                        sx={{mt: 2}}
                    >
                        {productId ? 'Save' : 'Publish'}
                    </LoadingButton>
                </Box>
            </Box>
        </Container>
    );
}

export default ProductForm;