import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, List, ListItem, Textarea, useToast, Heading, Text, Spinner, Center, Flex, Avatar } from "@chakra-ui/react";
import api from '../../utils/axios';
import { FaPlus } from 'react-icons/fa';

const UserDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [commentBodies, setCommentBodies] = useState({});
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [loadingComments, setLoadingComments] = useState({});
    const toast = useToast();

    useEffect(() => {
        if (id) {
            api.get(`/users/${id}`)
                .then(response => {
                    setUser(response.data);
                    setIsLoadingUser(false);
                })
                .catch(error => {
                    console.error('Error fetching user:', error);
                    setIsLoadingUser(false);
                });

            api.get(`/users/${id}/posts`)
                .then(response => {
                    const postsWithComments = response.data.map(post => ({ ...post, comments: [] }));
                    setPosts(postsWithComments);
                    return Promise.all(postsWithComments.map(post => fetchComments(post.id)));
                })
                .then(() => {
                    setIsLoadingPosts(false);
                })
                .catch(error => {
                    console.error('Error fetching posts:', error);
                    setIsLoadingPosts(false);
                });
        }
    }, [id]);

    const fetchComments = (postId) => {
        return api.get(`/public/v2/posts/${postId}/comments`)
            .then(response => {
                setPosts(prevPosts => prevPosts.map(post => post.id === postId ? { ...post, comments: response.data } : post));
            })
            .catch(error => {
                console.error(`Error fetching comments for post ${postId}:`, error);
            });
    };

    const createPost = () => {
        if (!postTitle || !postBody) {
            toast({
                title: "Validation Error",
                description: "Post title and body are mandatory.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        const postData = { title: postTitle, body: postBody };

        api.post(`/users/${id}/posts`, postData)
            .then(response => {
                setPosts([{ ...response.data, comments: [] }, ...posts ]);
                setPostTitle('');
                setPostBody('');
                toast({
                    title: "Post created.",
                    description: "The post has been created successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            })
            .catch(error => {
                console.error('Error creating post:', error);
            });
    };

    const createComment = (postId) => {
        const commentBody = commentBodies[postId];
        if (!commentBody) {
            toast({
                title: "Validation Error",
                description: "Add a comment to submit",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        const commentData = { body: commentBody, name: user.name, email: user.email };
        setLoadingComments({ ...loadingComments, [postId]: true });

        api.post(`/posts/${postId}/comments`, commentData)
            .then(response => {
                setPosts(posts.map(post => post.id === postId ? {
                    ...post,
                    comments: [...post.comments, response.data]
                } : post));
                setCommentBodies({ ...commentBodies, [postId]: '' });
                setLoadingComments({ ...loadingComments, [postId]: false });
                toast({
                    title: "Comment added.",
                    description: "The comment has been added successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            })
            .catch(error => {
                console.error('Error creating comment:', error);
                setLoadingComments({ ...loadingComments, [postId]: false });
            });
    };

    return (
        <Box p={8} maxW="1200px" mx="auto">
            {isLoadingUser ? (
                <Center>
                    <Spinner size="xl" color="teal.500" />
                </Center>
            ) : (
                user && (
                    <Box mb={8} p={4} borderWidth={1} borderRadius="lg" boxShadow="lg">
                        <Flex align="center">
                            <Avatar size="xl" name={user.name} src="images/profile.png" mr={8} bg="teal.500" />
                            <Box>
                                <Heading mb={2}>{user.name}</Heading>
                                <Text>Email: {user.email}</Text>
                                <Text>Gender: {user.gender}</Text>
                                <Text>Status: {user.status}</Text>
                            </Box>
                        </Flex>
                    </Box>
                )
            )}

            <Box mb={8} p={4} borderWidth={1} borderRadius="lg" boxShadow="lg">
                <Heading mb={4}>Create New Post</Heading>
                <FormControl id="title" mb={4} isRequired>
                    <FormLabel>Post Title</FormLabel>
                    <Input value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder="Enter post title" />
                </FormControl>
                <FormControl id="body" mb={4} isRequired>
                    <FormLabel>Post Body</FormLabel>
                    <Textarea value={postBody} onChange={(e) => setPostBody(e.target.value)} placeholder="Enter post body" />
                </FormControl>
                <Button colorScheme="teal" onClick={createPost} leftIcon={<FaPlus />}>
                    Create Post
                </Button>
            </Box>

            <Box>
                <Heading mb={4}>Posts</Heading>
                {isLoadingPosts ? (
                    <Center>
                        <Spinner size="xl" color="teal.500" />
                    </Center>
                ) : (
                    <List spacing={4}>
                        {posts.map(post => (
                            <Box key={post.id} p={4} borderWidth={1} borderRadius="lg" boxShadow="lg">
                                <Heading size="md" mb={2}>{post.title}</Heading>
                                <Text mb={4}>{post.body}</Text>
                                <Box mt={4}>
                                    <FormControl id="comment" mb={2}>
                                        <FormLabel>Comment</FormLabel>
                                        <Textarea
                                            value={commentBodies[post.id] || ''}
                                            onChange={(e) => setCommentBodies({ ...commentBodies, [post.id]: e.target.value })}
                                            placeholder="Add a comment"
                                        />
                                    </FormControl>
                                    <Button
                                        onClick={() => createComment(post.id)}
                                        colorScheme="teal"
                                        size="sm"
                                        isLoading={loadingComments[post.id]}
                                    >
                                        Add Comment
                                    </Button>
                                    <List spacing={2} mt={4}>
                                        {post.comments && post.comments.map(comment => (
                                            <ListItem key={comment.id}>
                                                <Box p={2} borderWidth={1} borderRadius="md" boxShadow="sm" bg="gray.100">
                                                    {comment.body}
                                                </Box>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </Box>
                        ))}
                    </List>
                )}
            </Box>
        </Box>
    );
};

export default UserDetails;
