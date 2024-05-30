// src/utils/axios.js
import axios from 'axios';

const API_URL = 'https://gorest.co.in/public/v2';
const ACCESS_TOKEN = 'e1a4f81584fa3bfebfff0297c80f63a3945e1775ffb7c183317567409c777a63';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
});

export default api;
