import React from 'react';
import { connect } from 'react-redux';

function mStp(state){
    return {
        access: state.auth.access
    }
}

export const AuthRequered = connect(mStp)(({children, access}) => {
    return <>
        {access ? children : <div style={{backgroundColor: "#eaeaea", filter: "blur(1px)", pointerEvents: "none"}} >{children}</div>}
    </>
})