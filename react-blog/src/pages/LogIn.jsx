import { Avatar, Box } from '@mui/material'
import React, { useEffect } from 'react'
import LockClockOutlined from '@mui/icons-material/LockClockOutlined'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userSignInAction } from '../redux/actions/userAction'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const validationSchema = yup.object({
    email: yup
        .string('Ingresa tu correo')
        .email('Ingresa un correo valido')
        .required('El correo es necesario'),
    password: yup
        .string('Ingresa tu contraseña')
        .min(8, 'La contraseña debe tener 8 caracteres')
        .required('La contraseña es necesaria'),
});



const LogIn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, userInfo } = useSelector(state => state.signIn);
    useEffect(() => {

        if (isAuthenticated) {
            if (userInfo.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        }

    }, [isAuthenticated])

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values, actions) => {
    
            dispatch(userSignInAction(values));
            actions.resetForm();
        }

    })

    return (
        <>
            <Navbar />
            <Box sx={{ height: '81vh', display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "primary.white" }}>


                <Box onSubmit={formik.handleSubmit} component="form" className='form_style border-style' >
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                        <Avatar sx={{ m: 1, bgcolor: "primary.main", mb: 3 }}>
                            <LockClockOutlined />
                        </Avatar>
                        <TextField
                            sx={{
                                mb: 3,
                                "& .MuiInputBase-root": {
                                    color: 'text.secondary',
                                },
                                fieldset: { borderColor: "rgb(231, 235, 240)" }
                            }}
                            fullWidth
                            id="email"
                            label="Correo"
                            name='email'
                            InputLabelProps={{
                                shrink: true,
                            }}

                            placeholder="Correo"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            sx={{
                                mb: 3,
                                "& .MuiInputBase-root": {
                                    color: 'text.secondary'
                                },
                                fieldset: { borderColor: "rgb(231, 235, 240)" }
                            }}
                            fullWidth
                            id="password"
                            name="password"
                            label="Contraseña"
                            type="password"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            placeholder="Contraseña"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />

                        <Button fullWidth variant="contained" type='submit' >Login</Button>
                    </Box>
                </Box>
            </Box>
            <Footer />
        </>
    )
}

export default LogIn