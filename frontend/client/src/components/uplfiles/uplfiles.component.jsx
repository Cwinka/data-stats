import React, {useRef, useState} from 'react';
import { connect, useDispatch } from "react-redux"
import styles from "./uplfiles.style.css";
import {
    upload_file
} from "../../redux/filesReduces"
import {
    DRAG_OVER_UPLOAD_BOX_MESSAGE,
    DROP_FILE_MESSAGE,
    MAX_FILE_SIZE,
    NOT_CSV_FILE_MESSAGE
} from "../../config"

const mapStateToProps = (state) => {
    return {
        existingFiles_: state.file_manager.files,
    }
}

export const UploadUserFile = connect(mapStateToProps)(({existingFiles_, width, height}) => {
    const existingFiles = existingFiles_.map(file => file.filename);
    const [dropMessage, setDropMessage] = useState(DROP_FILE_MESSAGE);
    const file_container = useRef(null);
    const dispatch = useDispatch();

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation()
        const file = e.dataTransfer.files[0];
        upload(file);
    }

    function handleChooseFile() {
        const file = file_container.current.files[0]
        file_container.current.value = '';
        upload(file);
    }

    function upload(file_) {
        if (!file_.name.includes(".csv")){
            setDropMessage(NOT_CSV_FILE_MESSAGE)
            return
        }
        if (existingFiles.includes(file_.name)){
            setDropMessage(`"${file_.name}" is already uploaded"`)
        } 
        if (file_.size < MAX_FILE_SIZE) {
            dispatch(upload_file(file_))
        } else {
            setDropMessage(`Too big file. Max size is ${Math.ceil(MAX_FILE_SIZE/1024/1024)} MB`)
        }
    }

    console.log("[UPLOAD BOX] rendered");
    return <>
        <form className={styles.drop} style={{width, height}}
            onDrop={handleDrop}
            onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation()}}
            onDragEnter={() => setDropMessage(DRAG_OVER_UPLOAD_BOX_MESSAGE)}
            onDragLeave={() => setDropMessage(DROP_FILE_MESSAGE)}>
            <span className={styles.message}>{dropMessage}</span>
            <input className={styles.file} name="file" type="file" id="file_" onChange={handleChooseFile} ref={file_container}/>
            <label htmlFor="file_" className={styles.label}>Выберите файл</label>
        </form>
    </>
})