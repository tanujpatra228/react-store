import { useEffect, useRef, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Typography, Container, Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Avatar, IconButton, Badge } from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators } from '../../store';
import { toast } from 'react-toastify';

const Profile = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const profileImageField = useRef();
    const [avatarImage, setAvatarImage] = useState('');
    const auth = useSelector(store => store.auth.currUser);
    const dispatch = useDispatch();

    const setUserData = (user=null) => {
        if(user !== null){
            formik.setFieldValue('name', user.name);
            formik.setFieldValue('email', user.email);
            formik.setFieldValue('birth_date', user.birth_date);
            formik.setFieldValue('gender', user.gender);

            // Profile image
            let imgSrc = (user.image?.includes('/')) ? `${user.image}` : `${process.env.REACT_APP_IMG_ROOT}${user.image}`;
            imgSrc = (user.image) ? `${imgSrc}` : 'https://via.placeholder.com/150';
            setAvatarImage(imgSrc);
        }
    }

    const getUserProfile = (isUpdated=false) => {
        axios.get(`${process.env.REACT_APP_API_ROOT}/getUserProfile`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
        })
        .then((res) => {
            // Set user data if available
            if (res.data.status){
                let {user} = res.data;
                isUpdated && dispatch(actionCreators.UpdateUserData(user));
                setUserData(user);
            } else {
                toast.error(`Can not fetch data, ${res.data.message || ''}`);
            }
        }).catch((error) => {
            toast.error(`Something went wrong! ${error.message}`);
            console.log('error', error);
        });
    }

    const handleSubmit = (values) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('birth_date', values.birth_date);
        formData.append('gender', values.gender);
        console.log('values.image', values.image);
        values.image && formData.append('image', values.image);
        formData.append('_method', 'PUT');

        axios.post(`${process.env.REACT_APP_API_ROOT}/profileUpdate/${auth.user.id}`, formData, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
        }).then((res) => {
            if (res.data.status) {
                toast.success('Profile Updated!');
                getUserProfile(true);
            } else {
                toast.error(res.data.message);
                alert(res.data.message);
            }
            setIsSubmitting(false);
        }).catch(error => {
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
            image: null,
        },

        // Validation
        validationSchema: Yup.object({
            name: Yup.string().required('Please enter Name'),
            email: Yup.string().required('Please enter Email').email('Invalid email'),
            birth_date: Yup.string().trim().required('Please enter Birthdate'),
            gender: Yup.string()
        }),

        // on Submit
        onSubmit: (values) => {
            handleSubmit(values);
        }
    });

    const getImgData = () => {
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
        getUserProfile();
    },[]);

    useEffect(()=>{
        getImgData();   // get image preview
    }, [getImgData, formik.values.image]);

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
                    Profile
                </Typography>
                <IconButton
                    onClick={() => profileImageField.current.querySelector('input[type="file"]').click()}
                    sx={{ p: 0 }}
                >
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <CameraAltIcon sx={{backgroundColor: '#fff', borderRadius: 50, p: 0.5}} />
                        }
                    >
                        <Avatar
                            alt={auth?.user?.name || ''}
                            src={avatarImage}
                            sx={{ width: 70, height: 70 }}
                        />
                    </Badge>
                </IconButton>
                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>

                    {/* Image */}
                    <TextField
                        required
                        name="image"
                        label="image"
                        type="file"
                        id="image"
                        sx={{display: 'none'}}
                        ref={profileImageField}
                        onChange={(e) => formik.setFieldValue('image', e.currentTarget.files[0])}
                        error={Boolean(formik.touched.image && formik.errors.image)}
                        helperText={formik.touched.image && formik.errors.image}
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
                        disabled
                        value={formik.values.birth_date}
                        onChange={formik.handleChange}
                        error={Boolean(formik.touched.birth_date && formik.errors.birth_date)}
                        helperText={formik.touched.birth_date && formik.errors.birth_date}
                    />

                    {/* Gender */}
                    <FormControl>
                        <FormLabel>Gender</FormLabel>
                        <RadioGroup row name="gender">
                            <FormControlLabel value="Male" disabled checked={formik.values.gender === 'Male'} onChange={formik.handleChange} control={<Radio />} label="Male" />
                            <FormControlLabel value="Female" disabled checked={formik.values.gender === 'Female'} onChange={formik.handleChange} control={<Radio />} label="Female" />
                        </RadioGroup>
                    </FormControl>

                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        loading={isSubmitting}
                        sx={{mt: 2}}
                    >
                        Profile
                    </LoadingButton>
                </Box>
            </Box>
        </Container>
    );
}

export default Profile;