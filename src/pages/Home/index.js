import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
import ProductList from '../../common/ProductList';

const Home = () => {

    const navigate = useNavigate();
    const auth = useSelector(store => store.auth);

    useEffect(() => {
        if (!Object.keys(auth).length) {
            navigate('/login');
        }
    }, [navigate, auth]);   // added navigate & auth into dependicency list to get rid of the warnings

    return (
        <div className='home'>
            {
                Object.keys(auth).length && (
                    <>
                        <div className='mb-5'>
                            <Typography variant='h3'>
                                All Products
                                <Link to="/product/add-new" className='ml-5'><Button variant="contained" disableElevation>Add New</Button></Link>
                            </Typography>
                        </div>
                        <div>
                            <ProductList auth={auth} />
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default Home;