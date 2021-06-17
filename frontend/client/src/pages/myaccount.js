import React from "react"
import { useDispatch } from "react-redux"
import { logOut } from '../redux/authReducer';


const LogInLink = () => {
    const dispatch = useDispatch();
    function handleLogout(){
        dispatch(logOut());
    }
    return <>
        <a href="#" onClick={handleLogout}>Log out</a>
    </>
}
export const MyAccount = () => {
    console.log("My account page render");
    return <>
        <div className="account">
            My Account
        </div>
        <LogInLink />
    </>
}