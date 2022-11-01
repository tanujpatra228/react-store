import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Nav from '../common/Nav';
import ProductForm from './ProductForm';
import Home from './Home';
import Login from './Login';
import Logout from './Logout';
import Profile from './Profile';
import Register from './Register';

const Pages = () => {
    return (
        <div className='bg-white-100 min-h-screen p-10'>
            <Nav />
            <main className='max-w-7xl mt-10 mx-auto'>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/logout' element={<Logout />} />
                    <Route path='/profile' element={<Profile />} />

                    <Route path='/product/add-new' element={<ProductForm />} />
                    <Route path='/product/edit' element={<ProductForm />} />
                </Routes>
            </main>
        </div>
    )
}

export default Pages;