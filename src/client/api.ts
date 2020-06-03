import { http } from 'gluegun';
import { token } from '../auth/variables.json'

const api = http.create({
    baseURL: 'https://plutom.herokuapp.com',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
});

export default api