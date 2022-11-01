import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import { TextField, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const useQuery = () => {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const ProductForm = () => {
    const auth = useSelector(store => store.auth);
    const navigate = useNavigate();
    const search = useQuery();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [productId, setProductId] = useState(search.get('id'));
    const [product, setProduct] = useState({
        name: '',
        description: '',
        mrp: 0,
        selling: 0,
        img: null
    });

    useEffect(() => {
        if (!Object.keys(auth).length) {
            navigate('/login');
        } else {
            getProductData();
        }
    }, [auth, navigate]);

    const basicValidation = (value) => {
        let isValid = false;
        if (value.name === ''){
            alert('Name is reuired');
        } else if (value.description === ''){
            alert('Description is reuired');
        } else if (value.mrp <= 0){
            alert('MRP must be greater then 0');
        } else if (value.selling <= 0){
            alert('Selling price must be greater then 0');
        } else if (value.img === null){
            alert('Please select product image');
        } else {
            isValid = true;
        }
        return isValid;
    }

    const addProduct = () => {
        if(!basicValidation(product)) {return;}

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('mrp', product.mrp);
        formData.append('selling', product.selling);
        product.img && formData.append('image', product.img);

        axios.post(`${process.env.REACT_APP_API_ROOT}/products`, formData, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
          }).then(res => {
            if (res.data.status) {
                setProduct({
                    name: res.data.data.name,
                    description: res.data.data.description,
                    mrp: res.data.data.mrp,
                    selling: res.data.data.selling,
                    img: res.data.data.img
                });
                alert(res.data.message.trim());
            } else {
                alert(res.data.message);
            }
            setIsSubmitting(false);
        }).catch(error => {
            console.log('error', error.message);
            setIsSubmitting(false);
        });
    }

    const getProductData = () => {
        if (productId === null) {return;}
        axios.get(`${process.env.REACT_APP_API_ROOT}/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
        }).then((res)=>{
            if (res.data.status) {
                setProduct({
                    name: res.data.data.name,
                    description: res.data.data.description,
                    mrp: res.data.data.mrp,
                    selling: res.data.data.selling,
                    img: res.data.data.img
                });
            }
        }).catch((error) => {
            console.log('error', error.message);
        });
    }

    const updateProduct = () => {
        if(!basicValidation(product)) {return;}

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('mrp', product.mrp);
        formData.append('selling', product.selling);
        (product.img !== null) && (typeof product.img !== 'string') && formData.append('image', product.img);
        formData.append('_method', 'PUT');

        axios.post(`${process.env.REACT_APP_API_ROOT}/products/${productId}`, formData, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
          }).then(res => {
            if (res.data.status) {
                getProductData();
                alert(res.data.message.trim());
            } else {
                alert(res.data.message);
            }
            setIsSubmitting(false);
        }).catch(error => {
            console.log('error', error.message);
            setIsSubmitting(false);
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!productId) {
            addProduct();
        } else {
            updateProduct();
        }
    }

    return(
        <div className="w-full">
            <h2 className="font-medium text-lg capitalize">Product</h2>
            <div className="flex justify-center align-middle">
                <div className="w-10/12 border rounded-lg shadow-lg p-5">
                    <img src={`${product.img}`} className='w-80 min-h-[300px] mb-5 rounded-lg' alr={product.name} onError={(e) => e.target.src='https://via.placeholder.com/300'} />
                    <form className='flex gap-5 flex-col' onSubmit={(e) => handleSubmit(e)}>
                        <div className='flex gap-5'>
                            <label htmlFor='image' className='text-slate-600'>Product Image</label>
                            <input type="file" accept="image/png, image/jpeg" className='w-1/2 flex-1' id="image" onChange={(e) => setProduct({...product, img: e.target.files[0]})}/>
                        </div>
                        <TextField id="name" label="Product Name" variant="outlined" value={product.name} onChange={(e) => setProduct({...product, name: e.target.value})}/>
                        <TextField id="description" label="Description" multiline rows={4} maxRows={4} variant="outlined" value={product.description} onChange={(e) => setProduct({...product, description: e.target.value})} />
                        <div className='flex gap-5'>
                            <TextField type="number" className='w-1/2' id="mrp" label="MRP" variant="outlined" value={product.mrp} onChange={(e) => setProduct({...product, mrp: e.target.value})}/>
                            <TextField type="number" className='w-1/2' id="selling" label="Selling" variant="outlined" value={product.selling} onChange={(e) => setProduct({...product, selling: e.target.value})} />
                        </div>
                        <Button className='w-1/2 mx-auto' variant="contained" type="submit" disabled={isSubmitting}>Submit</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProductForm;