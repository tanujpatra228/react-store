import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Nav = () => {
    const auth = useSelector(store => store.auth);
    return (
        <>
        <div className='p-5 shadow-lg absolute top-0 right-0 left-0'>
            <div className='max-w-7xl mx-auto flex justify-between items-center'>
                <h1 className='text-lg font-semibold'><Link to="/">STORE</Link></h1>
                <ul className='flex gap-5'>
                    <li><Link to="/">Products</Link></li>
                    { 
                        Object.keys(auth).length ? 
                            <>
                                <li><Link to="/profile">Profile</Link></li>
                                <li><Link to="/logout">Logout</Link></li>
                            </>
                        : 
                            <li><Link to="/login">Login</Link></li>
                    }
                </ul>
            </div>
        </div>
        </>
    )
}

export default Nav;