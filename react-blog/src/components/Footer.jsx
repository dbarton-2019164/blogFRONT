import { Box } from '@mui/material'
import React from 'react'

const Footer = () => {
    return (
        <>
            <Box sx={{ bgcolor: "rgba(0,0,0,.7)", height: "60px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ color: "#fafafa" }}>© Diego Barton. Todos los derechos reservados.</Box>
            </Box>
        </>
    )
}

export default Footer