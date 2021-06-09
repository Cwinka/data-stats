import axios from 'axios';
import { API_URL, ACCESS_TOKEN_NAME, ACCESS_TOKEN_TYPE_NAME} from "../config";
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";

class authService {
    cookies = new Cookies();
    
    get_config() {
        const [acc_t, acc_ty] = this.__getCred();
        return {
            headers: {Authorization: `${acc_ty} ${acc_t}`}
        }
    }
    async sayHi() {
        const url = `${API_URL}/hello`
        try {
            return await axios.get(url, this.get_config())
        } catch (e) {
            return e
        }
    }

    getAccessToken() {
        const [acc_t, acc_ty] = this.__getCred();
        if (!acc_ty){
            this.__removeCred()
            return ''
        }
        try {
            const {exp} = jwt_decode(acc_t);
            const stamp  = new Date().getTime()
            if (exp*1000 > stamp) {
                return acc_t
            }
        } catch (InvalidTokenError){
            this.__removeCred()
            return ''
        }
        this.__removeCred()
        return ''
    }
    /**
     * 
     * @returns {string} username
     */
    getUserName(){
        const acc_t = this.cookies.get(ACCESS_TOKEN_NAME)
        try {
            const {sub} = jwt_decode(acc_t);
            return sub
        } catch (InvalidTokenError){
            this.__removeCred()
            return ''
        }
    }
    async _logMe(username, password){
        const form = new FormData();
        form.append("username", username)
        form.append("password", password)
        const url = `${API_URL}/token`;
        const res = await axios.post(url, form)
        return res.data;
    }
    async logMe(username, password){
        try{
            const {access_token, token_type} = await this._logMe(username, password);
            if (access_token){
                this.__putCred(access_token, token_type)
                return {status: 200};
            }
        } catch(e) {
            return {status: 401, message: "Incorrect user or password"}
        }
    }
    logMeOut(){
        this.__removeCred();
    }
    /**
     * Remove access token and tokec type from the cookie
     */
    __removeCred() {
        this.cookies.remove(ACCESS_TOKEN_NAME);
        this.cookies.remove(ACCESS_TOKEN_TYPE_NAME);
    }
    /**
     * @param {string} access_token 
     * @param {string} token_type 
     */
    __putCred(access_token, token_type){
        this.cookies.set(ACCESS_TOKEN_NAME, access_token)
        this.cookies.set(ACCESS_TOKEN_TYPE_NAME, token_type)
    }
    /**
     * Returns access token and its type from the cookie
     * @returns {[string, string]} [access_token, token_type]
     */
    __getCred() {
        const access_token = this.cookies.get(ACCESS_TOKEN_NAME)
        const token_type = this.cookies.get(ACCESS_TOKEN_TYPE_NAME)
        return [access_token, token_type]
    }
}
const service = new authService();
export default service;

export const useAccessToken = () => {
    return service.getAccessToken();
};
export const useUserName = () => {
    return service.getUserName();
};