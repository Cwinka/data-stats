import axios from 'axios';
import Cookies from 'universal-cookie';

import { API_URL, API_VER, ACCESS_TOKEN_NAME, ACCESS_TOKEN_TYPE_NAME} from "../config";
import authService from "./authService"

class userFilesService {
    cookies = new Cookies();

    get_config(){
        return {
            headers: {Authorization: `${this.cookies.get(ACCESS_TOKEN_TYPE_NAME)} ${this.cookies.get(ACCESS_TOKEN_NAME)}`}
        }
    }
    async handleUnauthorizedEx(f){
        try{
            return await f();
        } catch (e){
            if (e.message === "Request failed with status code 401"){
                authService.logMeOut();
            }
            throw e
        }
    }
    async get_uploaded_user_file(){
        return this.handleUnauthorizedEx(async () => {
            const url = `${API_URL}/${API_VER}/cloud/files/list`;
            const files = await axios.get(url, this.get_config())
            return files.data.detail.files;
        })
    }
    async get_ten_rows(filename){
        const url = `${API_URL}/${API_VER}/cloud/files/first_ten?filename=${filename}`;
        const rows = await axios.get(url, this.get_config())
        return rows.data.detail
    }
    async upload_file(file) {
        const url = `${API_URL}/${API_VER}/cloud/files/upl`;
        const Form = new FormData();
        Form.append("data", (file))
        const responce = await axios.post(url, Form, this.get_config())
        return responce.data
    }
    async delete_file(filename){
        const url = `${API_URL}/${API_VER}/cloud/files/delete`;
        const result = await axios.delete(url, {...this.get_config(), data: {filename}})
        return result.data
    }
}
const service = new userFilesService();
export default service;