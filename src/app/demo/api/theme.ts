import axios from 'axios';

const API_URL = 'http://3.128.249.166:8000/api/themes/';

const themeApi = axios.create({
    baseURL: API_URL,
});

export default themeApi;
