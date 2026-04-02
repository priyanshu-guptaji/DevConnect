import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export const register = (data) => API.post('/users/register', data);
export const login = (data) => API.post('/users/login', data);
export const getAllUsers = () => API.get('/users/all');
export const getUser = (id) => API.get(`/users/${id}`);
export const updateUser = (data) => API.put('/users/update', data);
export const followUser = (id) => API.put(`/users/follow/${id}`);
export const getFollowing = () => API.get('/users/following');
export const getFollowers = () => API.get('/users/followers');

export const createProject = (data) => API.post('/projects', data);
export const getAllProjects = () => API.get('/projects');
export const getUserProjects = (userId) => API.get(`/projects/user/${userId}`);
export const getProject = (id) => API.get(`/projects/${id}`);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const likeProject = (id) => API.put(`/projects/like/${id}`);

export const createPost = (data) => API.post('/posts', data);
export const getAllPosts = () => API.get('/posts');
export const getUserPosts = (userId) => API.get(`/posts/user/${userId}`);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.put(`/posts/like/${id}`);
export const commentPost = (id, text) => API.post(`/posts/comment/${id}`, { text });

export const getConversations = () => API.get('/messages/conversations');
export const getMessages = (userId) => API.get(`/messages/${userId}`);
export const sendMessage = (data) => API.post('/messages', data);