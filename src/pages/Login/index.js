import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Typography, Container, Box, TextField } from '@mui/material';
import axios from 'axios';
import { actionCreators } from '../../store';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const Login = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (values) => {
        setIsSubmitting(true);
        axios.post(`${process.env.REACT_APP_API_ROOT}/login`,{
            email: values.email,
            password: values.password
        }).then((res)=>{
            if (!res.data.status){
                toast.error(res.data.message);
            } else {
                dispatch(actionCreators.LogIn(res.data));
                toast.success('Login Success!', {
                    autoClose: 2000,
                });
                setTimeout(() => {
                    navigate('/profile');
                }, 3000);
            }
            setIsSubmitting(false);
        }).catch((error) => {
            toast.error(`Something went wrong! ${error.message}`);
            console.log('error', error);
            setIsSubmitting(false);
        });
    };

    const formik = useFormik({
        // Initial values
        initialValues: {
            email: '',
            password: ''
        },

        // Validation
        validationSchema: Yup.object({
            email: Yup.string().required('Please enter Email').email('Invalid email'),
            password: Yup.string().required('Please enter Password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'Password must contain minimum 8 characters, at least one uppercase letter, one lowercase letter and one number'),
        }),

        // on Submit
        onSubmit: (values) => {
            handleSubmit(values);
        }
    });

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
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
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
                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        loading={isSubmitting}
                    >
                        Login
                    </LoadingButton>
                </Box>
                
                <Box component="div" sx={{ mt: 2 }}>
                    <Link to="/register" className='text-right'>
                        Don't have an account? <span className='underline'>Register</span>
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;