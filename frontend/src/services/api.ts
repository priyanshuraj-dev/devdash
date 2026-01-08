import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // send cookies with every request 
    withCredentials:true
})
export default api
