import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
import ProductList from '../../common/ProductList';

const Home = () => {
    const auth = useSelector(store => store.auth.currUser);

    return (
        <div className='home'>
            {
                Object.keys(auth).length && (
                    <Container component="div" maxWidth="lg">
                        <Box sx={{ mt: 8 }}>
                            <div className='mb-5'>
                                <Typography component="h1" variant="h5" sx={{mb: 2}}>
                                    All Products
                                    <Link to="/product/add-new" className='ml-5'><Button variant="contained" disableElevation>Add New</Button></Link>
                                </Typography>
                            </div>
                            <div>
                                <ProductList auth={auth} />
                            </div>
                        </Box>
                    </Container>
                )
            }
        </div>
    )
}

export default Home;