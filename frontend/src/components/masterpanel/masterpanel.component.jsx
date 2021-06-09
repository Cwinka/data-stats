import React from "react"
import {Link} from 'react-router-dom'
import { connect } from "react-redux"

import { URLS, MAX_ALL_FILES_SIZE } from '../../config'

const mapStateToProps = (state) => {
    return {
        username: state.auth.username,
        space_used: state.file_manager.space_used
    }
}

export const MasterPanel = connect(mapStateToProps)(({username, space_used}) => {
    console.log("Master panel render");
    return <div className="msp">
        <div className="logo msp--logo"></div>
        <div className="search msp--search"></div>
        <div className="msp--actions">
            <ul>
                { !username ?
                    <li><Link to={URLS.LOGIN}>Log in</Link></li> :
                    <li><Link to={URLS.MY_ACCOUNT}>{username}</Link></li>
                    }
            </ul>
            {username &&
            <div className="space-used">
                {Math.floor(space_used/MAX_ALL_FILES_SIZE *100)}% space used
            </div>}
        </div>
    </div>
})
