import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Button, Divider, Avatar } from '@mui/material';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import moment from 'moment';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import CommentList from '../components/CommentList';
import { io } from 'socket.io-client';

const socket = io('/', {
    reconnection: true
});

const SinglePost = () => {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [commentsRealTime, setCommentsRealTime] = useState([]);
    const { id } = useParams();

    const displaySinglePost = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://127.0.0.1:8080/blog/v1/post/${id}`);
            setTitle(data.post.title);
            setContent(data.post.content);
            setImage(data.post.image.url);
            setCreatedAt(data.post.createdAt);
            setLoading(false);
            setComments(data.post.comments);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        displaySinglePost();
    }, []); 

    useEffect(() => {
        socket.on('new-comment', (newComment) => {
            setCommentsRealTime(newComment);
        })
    }, []);

    const addComment = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`http://127.0.0.1:8080/blog/v1/post/comment/${id}`, { name, comment });
            if (data.success === true) {
                setName('');
                setComment('');
                toast.success("Comment posted");
                socket.emit('comment', data.post.comments);
            }
        } catch (error) {
            console.log(error);
            toast.error(error);
        }
    }

    let uiCommentUpdate = commentsRealTime.length > 0 ? commentsRealTime : comments;

    return (
        <>
            <Navbar />
            <Box sx={{ bgcolor: "#fafafa", display: 'flex', justifyContent: 'center', pt: 4, pb: 4, minHeight: "100vh" }}>
                {
                    loading ? <Loader /> :
                        <>
                            <Card sx={{ maxWidth: 1000, height: '100%' }}>
                                <CardHeader
                                    avatar={<Avatar aria-label="recipe">R</Avatar>}
                                    title={title}
                                    subheader={moment(createdAt).format('MMMM DD, YYYY')}
                                />
                                <CardMedia
                                    component="img"
                                    height="194"
                                    image={image}
                                    alt={title}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        <Box component='span' dangerouslySetInnerHTML={{ __html: content }}></Box>
                                    </Typography>
                                    <Divider variant="inset" />
                                    {comments.length === 0 ? '' : <Typography variant='h5' sx={{ pt: 3, mb: 2 }}>Comentarios:</Typography>}
                                    {uiCommentUpdate.map(comment => (
                                        <CommentList key={comment._id} name={comment.name} text={comment.text} />
                                    ))}
                                    <Box sx={{ pt: 1, pl: 3, pb: 3, bgcolor: "#fafafa" }}>
                                        <h2>Comenta aquí!</h2>
                                        <form onSubmit={addComment}>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Your name"
                                                style={{ width: 300, padding: "5px", marginRight: "10px" }}
                                            />
                                            <textarea
                                                onChange={(e) => setComment(e.target.value)}
                                                value={comment}
                                                placeholder="Add a comment..."
                                                style={{ width: 500, padding: "5px" }}
                                            />
                                            <Box sx={{ pt: 1 }}>
                                                <Button type='submit' variant='contained'>Comentar</Button>
                                            </Box>
                                        </form>
                                    </Box>
                                </CardContent>
                            </Card>
                        </>
                }
            </Box>
            <Footer />
        </>
    );
}

export default SinglePost;
