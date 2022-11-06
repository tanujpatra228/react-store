import { useEffect, useRef, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Typography, Container, Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Avatar, IconButton, Badge } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { toast } from 'react-toastify';

const Register = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatarImage, setAvatarImage] = useState('');
    const profileImageField = useRef();
    const navigate = useNavigate();
    const allowed_formats = [
        "image/jpg",
        "image/jpeg",
        "image/png",
    ];

    const handleSubmit = (values) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('birth_date', values.birth_date);
        formData.append('gender', values.gender);
        formData.append('password', values.password);
        formData.append('password_confirmation', values.password_confirmation);
        values.image && formData.append('image', values.image);

        axios.post(`${process.env.REACT_APP_API_ROOT}/register`, formData)
            .then(res => {
                if (res.data.status) {
                    toast.success(res.data.message, {
                        autoClose: 2000,
                    });
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                    formik.resetForm();
                } else {
                    toast.error(res.data.message);
                }
                setIsSubmitting(false);
            })
            .catch(error => {
                toast.error(`Something went wrong! ${error.message}`);
                console.log('error', error);
                setIsSubmitting(false);
            });
    };

    const formik = useFormik({
        // Initial values
        initialValues: {
            name: '',
            email: '',
            birth_date: ' ',
            gender: 'Male',
            password: '',
            password_confirmation: '',
            image: null,
        },

        // Validation
        validationSchema: Yup.object({
            name: Yup.string().required('Please enter Name'),
            email: Yup.string().required('Please enter Email').email('Invalid email'),
            birth_date: Yup.string().trim().required('Please enter Birthdate'),
            gender: Yup.string(),
            password: Yup.string().required('Please enter Password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'Password must contain minimum 8 characters, at least one uppercase letter, one lowercase letter and one number'),
            password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
        }),

        // on Submit
        onSubmit: (values) => {
            handleSubmit(values);
        }
    });

    const setImagePreview = () => {
        const file = formik.values.image || null;
        if (file) {
            const reader = new FileReader();
            reader.onload = function(){
                setAvatarImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    useEffect(()=>{
        setImagePreview();   // get image preview
    }, [formik.values.image]);

    return (
        <Container component="div" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5" sx={{mb: 2}}>
                    Register
                </Typography>
                <IconButton onClick={() => profileImageField.current.click()} sx={{ p: 0 }}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <CameraAltIcon sx={{backgroundColor: '#fff', borderRadius: 50, p: 0.5}} />
                        }
                    >
                        <Avatar
                            alt="User Image"
                            src={avatarImage}
                            sx={{ width: 70, height: 70 }}
                        />
                    </Badge>
                </IconButton>
                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>

                    {/* Image */}
                    <input
                        required
                        name="image"
                        label="image"
                        type="file"
                        id="image"
                        accept={allowed_formats.join()}
                        style={{display: 'none'}}
                        ref={profileImageField}
                        onChange={(e) => formik.setFieldValue('image', e.currentTarget.files[0])}
                    />

                    {/* Name */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        autoFocus
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />

                    {/* Email */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoFocus
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />

                    {/* Date of Birth */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="birth_date"
                        label="DOB"
                        type="date"
                        id="birth_date"
                        value={formik.values.birth_date}
                        onChange={formik.handleChange}
                        error={Boolean(formik.touched.birth_date && formik.errors.birth_date)}
                        helperText={formik.touched.birth_date && formik.errors.birth_date}
                    />

                    {/* Gender */}
                    <FormControl>
                        <FormLabel>Gender</FormLabel>
                        <RadioGroup row name="gender">
                            <FormControlLabel value="Male" checked={formik.values.gender === 'Male'} onChange={formik.handleChange} control={<Radio />} label="Male" />
                            <FormControlLabel value="Female" checked={formik.values.gender === 'Female'} onChange={formik.handleChange} control={<Radio />} label="Female" />
                        </RadioGroup>
                    </FormControl>

                    {/* Password */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={Boolean(formik.touched.password && formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    
                    {/* Password Confirmation */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password_confirmation"
                        label="Re-enter Password"
                        type="password"
                        id="password"
                        value={formik.values.password_confirmation}
                        onChange={formik.handleChange}
                        error={Boolean(formik.touched.password_confirmation && formik.errors.password_confirmation)}
                        helperText={formik.touched.password_confirmation && formik.errors.password_confirmation}
                    />

                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        loading={isSubmitting}
                    >
                        Register
                    </LoadingButton>
                </Box>
                <Box component="div" sx={{ mt: 2 }}>
                    <Link to="/login">
                        Already have an account? <span className='underline'>Login</span>
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}

export default Register;