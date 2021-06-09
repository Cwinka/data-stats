import React from "react"
import { connect } from 'react-redux';
import { Route, Redirect } from "react-router-dom";

import { URLS } from '../config';

const mapStateToProps = (state) => {
    return {
        access: state.auth.username,
    }
}
export const PrivateRoute = connect(mapStateToProps)(({ component, access, ...rest }) => {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                access ? component() : (
                    <Redirect
                        to={{
                            pathname: URLS.LOGIN,
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
})