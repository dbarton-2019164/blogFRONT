import { Box } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux';

const UserDashboard = () => {

    const { user } = useSelector(state => state.userProfile);

    return (
        <>
            <Box sx={{ bgcolor: "white", p: 3 }}>
                <h1>Dashboard</h1>
                <p>Nombre: {user && user.name}</p>
                <p>Correo: {user && user.email}</p>
                <p>Rol: {user && user.role}</p>
            </Box>
        </>
    )
}

export default UserDashboard