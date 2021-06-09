import React from 'react';
import {LoginForm} from "../components/loginform";

export const LoginPage = ({location}) => {
    console.log("Login page render");
    return <>
        <LoginForm location={location}/>
    </>
}
