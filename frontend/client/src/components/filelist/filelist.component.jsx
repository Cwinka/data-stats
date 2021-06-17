import React, { useEffect } from 'react';
import { connect, useDispatch } from "react-redux"
import styles from "./filelist.style.css"
import service from "../../services/userFilesServise"
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

export const UserFiles = connect(mapStateToProps)(React.memo( ({ files }) => {
    const dispatch = useDispatch();

    function deleteFile(filename) {
        const size = files.filter(file => file.filename === filename)[0].Size
        service.delete_file(filename)
            .then(() => {
                dispatch(del_file(filename));
                dispatch(update_space_used(-size));
            })
    }

    console.log("User files render");
    return <>
        <div className={styles.my_files}>
            <h4>My files</h4>
            {!files.length && <p> No files yet</p>}
            <ul className={styles.list}>
                {files.map((file) => {
                    const [filename, ext] = file.filename.split(".")
                    return (
                        <li className={styles.file_item} key={file.filename}>
                            <span>{filename}</span><span>.{ext}</span>
                            <span className={styles.dl_btn} onClick={() => deleteFile(file.filename)}>&Chi;</span>
                            <br />
                            <DisplayDetailsButton btn_cls="btn btn-sm" fl_name={file.filename} />
                        </li>
                    )
                })}
            </ul>
        </div>
    </>
}))
