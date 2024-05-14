import React, { useEffect, useState } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment'
import axios from 'axios'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';


const AdminDashboard = () => {

    const [posts, setPosts] = useState([]);

    const displayPost = async () => {
        try {
            const { data } = await axios.get('http://127.0.0.1:8080/blog/v1/post/show');
            setPosts(data.posts);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        displayPost();
    }, [])


    //borrar publicacion
    const deletePostById = async (e, id) => {
      
        if (window.confirm("Seguro que quieres borrar esta publicacion?")) {
            try {
                const { data } = await axios.delete(`http://127.0.0.1:8080/blog/v1/post/delete/${id}`);
                if (data.success === true) {
                    toast.success(data.message);
                    displayPost();
                }
            } catch (error) {
                console.log(error);
                toast.error(error);
            }
        }
    }



    const columns = [
 
        {
            field: '_id',
            headerName: 'Post ID',
            width: 150,
            editable: true,
        },
        {
            field: 'title',
            headerName: 'Post title',
            width: 150,
        },

        {
            field: 'image',
            headerName: 'Image',
            width: 150,
            renderCell: (params) => (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img width="40%" src={params.row.image.url} />
            )

        },
        {
            field: 'likes',
            headerName: 'Likes',
            width: 150,
            renderCell: (params) => (
                params.row.likes.length
            )
        },
        {
            field: 'comments',
            headerName: 'Comments',
            width: 150,
            renderCell: (params) => (
                params.row.comments.length
            )
        },
       
        {
            field: 'createdAt',
            headerName: 'Create At',
            width: 150,
            renderCell: (params) => (
                moment(params.row.createdAt).format('YYYY-MM-DD HH:MM:SS')
            )
        },

        {
            field: "Actions",
            width: 100,
            renderCell: (value) => (
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "170px" }}>
                    <Link to={`/admin/post/edit/${value.row._id}`}>
                        <IconButton aria-label="edit" >
                            <EditIcon sx={{ color: '#1976d2' }} />
                        </IconButton>
                    </Link>
                    <IconButton aria-label="delete" onClick={(e) => deletePostById(e, value.row._id)} >
                        <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>

                </Box>
            )
        }
    ];


    return (
        <Box >

            <Typography variant="h4" sx={{ color: "black", pb: 3 }}>
                Posts
            </Typography>
            <Box sx={{ pb: 2, display: "flex", justifyContent: "right" }}>
                <Button variant='contained' color="success" startIcon={<AddIcon />}><Link style={{ color: 'white', textDecoration: 'none' }} to='/admin/post/create'>Crear publicacion</Link> </Button>
            </Box>
            <Paper sx={{ bgcolor: "white" }} >

                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        getRowId={(row) => row._id}
                        sx={{

                            '& .MuiTablePagination-displayedRows': {
                                color: 'black',
                            },
                            color: 'black',
                            [`& .${gridClasses.row}`]: {
                                bgcolor: "white"
                            },

                        }}
                        rows={posts}
                        columns={columns}
                        pageSize={3}
                        rowsPerPageOptions={[3]}
                        checkboxSelection
                    />
                </Box>
            </Paper>

        </Box>
    )
}

export default AdminDashboard