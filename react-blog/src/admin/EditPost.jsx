import { Box, Button, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik';
import * as yup from 'yup';
import Dropzone from 'react-dropzone'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { modules } from '../components/moduleToolbar';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';



const validationSchema = yup.object({
    title: yup
        .string('Ingresa el titulo')
        .min(4, 'El titulo debe tener al menos 4 caracteres')
        .required('El titulo es obligatorio'),
    content: yup
        .string('Ingresa el contenido')
        .min(10, 'El contenido debe tener al menos 10 caracteres')
        .required('El contenido es obligatorio'),
});



const EditPost = () => {

    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    const navigate = useNavigate();

    const {
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue
    } = useFormik({
        initialValues: {
            title,
            content,
            image: ''
        },

        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values, actions) => {
            updatePost(values);
            actions.resetForm();
        },
    });


    //un post por id
    const singlePostById = async () => {
        try {
            const { data } = await axios.get(`http://127.0.0.1:8080/blog/v1/post/${id}`);
            setTitle(data.post.title);
            setContent(data.post.content);
            setImagePreview(data.post.image.url);
            
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    }

    useEffect(() => {
        singlePostById()
    }, [])

    const updatePost = async (values) => {
        try {
            const { data } = await axios.put(`http://127.0.0.1:8080/blog/v1/post/update/${id}`, values);
            if (data.success === true) {
                toast.success('Publicado exitosamente');
                navigate('/admin/dashboard')
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error);
        }
    }


    return (
        <>
            <Box sx={{ bgcolor: "white", padding: "20px 200px" }}>
                <Typography variant='h5' sx={{ pb: 4 }}> Edit post  </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField sx={{ mb: 3 }}
                        fullWidth
                        id="title"
                        label="Titulo"
                        name='title'
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder="Titulo"
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.title && Boolean(errors.title)}
                        helperText={touched.title && errors.title}
                    />


                    <Box sx={{ mb: 3 }}>
                        <ReactQuill
                            theme="snow"
                            placeholder={'Escribe el contenido...'}
                            modules={modules}
                            value={values.content}
                            onChange={(e) => setFieldValue('content', e)}
                        />
                        <Box component='span' sx={{ color: '#d32f2f', fontSize: "12px", pl: 2 }}>{touched.content && errors.content}</Box>
                    </Box>

                    <Box border='2px dashed blue' sx={{ p: 1 }}>
                        <Dropzone
                            acceptedFiles=".jpg,.jpeg,.png"
                            multiple={false}
                            //maxFiles={3}
                            onDrop={(acceptedFiles) =>
                                acceptedFiles.map((file, index) => {
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onloadend = () => {
                                        setFieldValue('image', reader.result)
                                    }
                                })
                            }
                        >
                            {({ getRootProps, getInputProps, isDragActive }) => (
                                <Box
                                    {...getRootProps()}

                                    p="1rem"
                                    sx={{ "&:hover": { cursor: "pointer" }, bgcolor: isDragActive ? "#cceffc" : "#fafafa" }}
                                >
                                    <input name="image" {...getInputProps()} />
                                    {
                                        isDragActive ? (
                                            <>
                                                <p style={{ textAlign: "center" }}><CloudUploadIcon sx={{ color: "primary.main", mr: 2 }} /></p>
                                                <p style={{ textAlign: "center", fontSize: "12px" }}> Suelte aquí </p>

                                            </>
                                        ) :

                                            values.image === null ?

                                                <>
                                                    <p style={{ textAlign: "center" }}><CloudUploadIcon sx={{ color: "primary.main", mr: 2 }} /></p>
                                                    <p style={{ textAlign: "center", fontSize: "12px" }}>Arrastre y suelte aquí o haga clic para elegir</p>
                                                </> :



                                                <>
                                                    <Box sx={{ display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>

                                                        <Box ><img style={{ maxWidth: "100px" }} src={values.image === '' ? imagePreview : values.image} alt="" /></Box>
                                                    </Box>
                                                </>
                                    }
                                </Box>
                            )}
                        </Dropzone>
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        elevation={0}
                        sx={{ mt: 3, p: 1, mb: 2, borderRadius: "25px", }}
                    // disabled={loading}
                    >
                        Editar publicacion
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default EditPost