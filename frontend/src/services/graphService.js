import axios from 'axios';
import Cookies from 'universal-cookie';

import { API_URL, API_VER, ACCESS_TOKEN_NAME, ACCESS_TOKEN_TYPE_NAME} from "../config";

class graphService {
    cookies = new Cookies();

    get_config(){
        return {
            headers: {Authorization: `${this.cookies.get(ACCESS_TOKEN_TYPE_NAME)} ${this.cookies.get(ACCESS_TOKEN_NAME)}`}
        }
    }
    async get_histogramm(filename, column){
        const url = `${API_URL}/${API_VER}/graph/hist`;
        const rows = await axios.post(url, {fp: {filename}, settings: {x_column:column}}, this.get_config())
        return rows.data
    }
    async get_scatter(filename, x_col, y_col){
        const url = `${API_URL}/${API_VER}/graph/scatter`;
        const rows = await axios.post(url, {fp: {filename}, settings: {x_column:x_col, y_column: y_col}}, this.get_config())
        return rows.data
    }

}
const service = new graphService();
export default service;