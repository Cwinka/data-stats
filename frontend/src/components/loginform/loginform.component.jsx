import React from "react"
import { Redirect } from 'react-router';
import { connect, useDispatch } from "react-redux";

import { logIn } from "../../redux/authReducer";
import { URLS } from '../../config'


const mapStateToProps = (state) => {
    return {
        access: state.auth.username,
        error: state.auth.error
    }
}
export const LoginForm = connect(mapStateToProps)(({location, access, error}) => {
    const to = location.state ? location.state.from.pathname : URLS.HOME
    const dispatch = useDispatch();
    function handS (e) {
        e.preventDefault();
        const u_name = e.target.username.value;
        const u_pas = e.target.password.value;
        dispatch(logIn(u_name, u_pas))
    }
    if (access) {
        return <Redirect to={to}/>
    }
    return <>
        <form onSubmit={handS}>
            <label htmlFor="username">Username</label>
            <input type="text" name="username"/>
            <br/>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" autoComplete="true"/>
            <button type="submit">Log in</button>
        </form>
        {error && error}
    </>
})
