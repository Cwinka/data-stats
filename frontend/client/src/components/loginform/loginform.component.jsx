import React, { useRef } from "react"
import { connect, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { URLS } from "../../config";

import { logIn, registerUser } from "../../redux/authReducer";

const mapStateToProps = (state) => {
    return {
        error: state.auth.error,
        access: state.auth.access
    }
}
export const LoginForm = connect(mapStateToProps)(({ error, access }) => {

    if(access){
        return <Redirect to={URLS.MY_ACCOUNT}/>
    }

    const e_ref = useRef();
    const pas_ref = useRef();
    const dispatch = useDispatch();

    function ifRefsNoEmtyDo(action) {
        if (e_ref.current.value && pas_ref.current.value){
            return action();
        }
    }
    const login = (e) => {
        e.preventDefault();
        ifRefsNoEmtyDo(() => {
            dispatch(logIn(e_ref.current.value, pas_ref.current.value));
        })
    }
    const regUser = (e) => {
        e.preventDefault();
        ifRefsNoEmtyDo(() => {
            dispatch(registerUser(e_ref.current.value, pas_ref.current.value));
        })
    }
    console.log("[LOGIN FORM] rendered");
    return <>
        <form>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" ref={e_ref} required/>
            <br />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" ref={pas_ref} autoComplete="true" required/>
            <br />
            <button type="submit" onClick={login}>
                Log in
            </button>
            <button type="submit" onClick={regUser}>
                Register
            </button>
        </form>
        {error && error}
    </>
})