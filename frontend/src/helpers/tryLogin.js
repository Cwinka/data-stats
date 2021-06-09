import React from "react"
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { logInWithCred } from "../redux/authReducer";


export const TryLoginWithCookie = ({children}) => {
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(logInWithCred())
    }, [])
    return children
}
