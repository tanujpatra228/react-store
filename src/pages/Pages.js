import React, { lazy, Suspense } from 'react';
import {Routes, Route} from 'react-router-dom';
import Nav from '../common/Nav';
import Login from './Login';
import ProtectedRoute from '../common/ProtectedRoute';
import Notify from '../common/Notify';
import { Skeleton } from '@mui/material';

const Pages = () => {
    const Home = lazy(()=> import('./Home'));
    const Logout = lazy(()=> import('./Logout'));
    const Profile = lazy(()=> import('./Profile'));
    const Register = lazy(()=> import('./Register'));
    const ProductForm = lazy(()=> import('./ProductForm'));
    return (
        <div className='bg-white-100 min-h-screen p-10'>
            <Nav />
            <main className='max-w-7xl mx-auto'>
                <Suspense fallback={<Skeleton style={{ width: 400, height: 600, margin: 'auto' }} />}>
                    <Routes>
                        <Route path='/register' element={<Register />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/logout' element={<Logout />} />
                        
                        <Route path='/' element={<ProtectedRoute component={Home} />} />
                        <Route path='/profile' element={<ProtectedRoute component={Profile} />} />

                        <Route path='/product/add-new' element={<ProtectedRoute component={ProductForm} />} />
                        <Route path='/product/edit/:productId' element={<ProtectedRoute component={ProductForm} />} />

                        <Route path='*' element={<ProtectedRoute component={Home} />} />
                    </Routes>
                </Suspense>
            </main>
            <Notify />
        </div>
    )
}

export default Pages;