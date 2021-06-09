import React, {useRef} from 'react';
import { connect, useDispatch } from "react-redux"

import {
    set_upl_message,
    upload_file
} from "../../redux/filesReduces"
import {
    DRAG_OVER_UPLOAD_BOX_MESSAGE,
    DROP_FILE_MESSAGE,
    NOT_CSV_FILE_MESSAGE
} from "../../config"

const mapStateToProps = (state) => {
    return {
        existingFiles_: state.file_manager.files,
        message: state.file_manager.upl_message,
    }
}

export const UploadUserFile = connect(mapStateToProps)(({existingFiles_, message, width, height}) => {
    const existingFiles = existingFiles_.map(file => file.filename);
    const file_container = useRef(null);
    const dispatch = useDispatch();

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation()
        const file = e.dataTransfer.files[0];
        upload(file);
    }
    function dragEnter() {
        dispatch(set_upl_message(DRAG_OVER_UPLOAD_BOX_MESSAGE))
    }
    function dragLeave() {
        dispatch(set_upl_message(DROP_FILE_MESSAGE))
    }
    function handleChooseFile() {
        const file = file_container.current.files[0]
        file_container.current.value = '';
        upload(file)
    }

    function upload(file_) {
        if (!file_.name.includes(".csv")){
            dispatch(set_upl_message(NOT_CSV_FILE_MESSAGE))
            return
        }
        if (existingFiles.includes(file_.name)){
            dispatch(set_upl_message(`"${file_.name}" is already uploaded"`))
        } else {
            dispatch(upload_file(file_))
        }
    }

    console.log("User upload file render");
    return <>
        <form className="drop drop--area" style={{width, height}}
            onDrop={handleDrop}
            onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation()}}
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}>
            <span className="drop__message">{message}</span>
            <input className="drop__file" name="file" type="file" id="file_" onChange={handleChooseFile} ref={file_container}/>
            <label htmlFor="file_" className="drop__label">Выберите файл</label>
        </form>
    </>
})