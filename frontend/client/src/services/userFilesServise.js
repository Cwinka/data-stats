import {$python_api} from "../api";


export default class userFilesService {

    static async get_uploaded_user_files(){
        return await $python_api.get('/cloud/files/list')
    }
    static async get_ten_rows(filename){
        return await $python_api.get(`/cloud/files/first_ten?filename=${filename}`)
    }
    static async upload_file(file) {
        const Form = new FormData();
        Form.append("data", (file))
        return await $python_api.post('/cloud/files/upl', Form);
    }
    static async delete_file(filename){
        return await $python_api.delete('/cloud/files/delete', {data: {filename}})
    }
}