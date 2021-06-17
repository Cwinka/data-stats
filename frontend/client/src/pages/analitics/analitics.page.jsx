import React from "react"
import styles from "./analytics.style.css";
import {UserFiles} from "../../components/filelist";
import {UploadUserFile} from "../../components/uplfiles";
import {FileDetails} from "../../components/filedetails"


export const Analitycs = () => {
    console.log("Analitics page render");
    return <>
        <div className={styles.analitics}>
            <div className={styles.main}>
                <UploadUserFile width="700px" height="100px" />
                <FileDetails/>
            </div>
            <div className={styles.rest}>
                <UserFiles />
            </div>
        </div>
    </>
}