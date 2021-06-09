import { Redirect } from 'react-router';
import React, { useEffect } from 'react';
import { connect, useDispatch } from "react-redux"

import { URLS } from '../../config';
import service from "../../services/userFilesServise"
import { useUserName } from '../../services/authService';
import {
    fetch_files,
    del_file,
    update_space_used
} from "../../redux/filesReduces"
import { DisplayDetailsButton } from "../filedetails"


const mapStateToProps = (state) => {
    return {
        files: state.file_manager.files,
    }
}

export const UserFiles = connect(mapStateToProps)(({ files }) => {
    const dispatch = useDispatch();
    const username_p = useUserName();

    useEffect(() => {
        dispatch(fetch_files())
    }, []);

    function deleteFile(filename) {
        const size = files.filter(file => file.filename === filename)[0].Size
        service.delete_file(filename)
            .then(() => {
                dispatch(del_file(filename))
                dispatch(update_space_used(-size))
            })
    }

    console.log("User files render");
    return <>
        {!username_p && <Redirect to={URLS.LOGIN} />}
        <div className="my-files">
            <h4>My files</h4>
            {!files.length && <p> No files yet</p>}
            <ul className="my-files__list">
                {files.map((file) => {
                    const [filename, ext] = file.filename.split(".")
                    return (
                        <li className="file-item">
                            <span>{filename}</span><span>.{ext}</span>
                            <span className="file-item__delete" onClick={() => deleteFile(file.filename)}>&Chi;</span>
                            <br />
                            <DisplayDetailsButton btn_cls="btn btn-sm file-item__show-details" fl_name={file.filename} />
                        </li>
                    )
                })}
            </ul>
        </div>
    </>
})
