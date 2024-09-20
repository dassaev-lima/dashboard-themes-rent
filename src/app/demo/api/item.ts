import axios from 'axios';

const API_URL = 'http://3.128.249.166:8000/api/itens/';

const ItemApi = axios.create({
    baseURL: API_URL,
});

export default ItemApi;
