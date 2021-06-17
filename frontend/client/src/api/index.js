import axios from "axios";

export const API_URL = 'http://localhost:5000/api';
export const API_PYTHON_URL = 'http://localhost:8000/api_v0';

export const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})
export const $python_api = axios.create({
    baseURL: API_PYTHON_URL
})


async function refreshInterceptor(api, error) {
    const origReq = error.response;
    if(origReq.status === 401 && origReq && origReq._isRetry !== true){
        origReq._isRetry = true;
        try {
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials:true});
            const {accessToken}  = response.data;
            localStorage.setItem('token', accessToken);
            return api.request(origReq.config);
        } catch (e){
            console.log("Not autorized");
        }
    } else if (origReq.status !== 401) {
        console.log("Strange error");
        throw error;
    }
}
$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
})
$api.interceptors.response.use((config) => {
    return config
}, async (error) => await refreshInterceptor($api, error))

$python_api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
})
$python_api.interceptors.response.use((config) => {
    return config
}, async (error) => await refreshInterceptor($python_api, error))