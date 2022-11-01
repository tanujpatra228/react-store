import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { Stack, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";

const ProductList = ({auth}) => {
    const [products, setProducts] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const columns = [
        {
            name: 'Image',
            cell: (row) => {
                return(<img src={row.img || 'https://via.placeholder.com/150'} style={{width: '100px', height: '100px', objectFit:'contain'}} alt={row.name} />)
            }
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortField: 'name',
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortField: 'description',
        },
        {
            name: 'MRP',
            selector: row => row.mrp,
            sortable: true,
            sortField: 'mrp',
        },
        {
            name: 'Selling Price',
            selector: row => row.selling,
            sortable: true,
            sortField: 'selling',
        },
        {
            name: 'Action',
            cell: (row) => {
                return(
                    <Stack spacing={2} direction="row">
                        <Link to={{pathname:`/product/edit`, search: `?id=${row.id}`, state: {'name':row.id}}}><IconButton aria-label="Edit" color="primary" size="small" disableElevation><EditIcon/></IconButton></Link>
                        <IconButton aria-label="Delete" color="error" size="small" disableElevation onClick={() => deleteProduct(row.id)}><DeleteIcon/></IconButton>
                    </Stack>
                )
            }
        },
    ];

    useEffect(()=>{
        getProducts();
    }, []);

    const getProducts = async (page=1) => {
        setIsLoading(true);
        axios.get(`${process.env.REACT_APP_API_ROOT}/products?page=${page}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
        }).then((res)=>{
            if (res.data.status) {
                setTotalRows(res.data.data.total);
                setProducts(res.data.data.data);
            }
            setIsLoading(false);
        }).catch((error) => {
            console.log('error', error.message);
        });
    }

    const deleteProduct = (id=0) => {
        if (!id) {return;}
        axios.delete(`${process.env.REACT_APP_API_ROOT}/products/${id}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
            }
        }).then((res) => {
            if (res.data.status) {
                const currPage = localStorage.getItem('currPage') || 1;
                getProducts(currPage);
                alert(`${res.data.message}`);
            }
        }).catch((error) => {
            console.log('error', error);
        });
    }

    const handlePageChange = (page) => {
        localStorage.setItem('currPage', page);
		getProducts(page);
	};

    return(
        <>
            <DataTable
                progressPending={isLoading}
                pagination={true}
                columns={columns}
                data={products}
                paginationServer
                paginationTotalRows={totalRows}
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5]}
                onChangePage={handlePageChange}
            />
        </>
    );
}

export default ProductList;