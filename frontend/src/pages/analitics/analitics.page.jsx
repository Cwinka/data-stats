import React from "react"

import {UserFiles} from "../../components/filelist";
import {UploadUserFile} from "../../components/uplfiles";
import {FileDetails} from "../../components/filedetails"


export const DataBox = () => {
    console.log("Analitics page render");
    return <>
        <div className="analitics">
            <div className="analitics-main">
                <UploadUserFile width="700px" height="100px" />
                <FileDetails/>
            </div>
            <div className="analitics-helpers">
                <UserFiles />
            </div>
        </div>
    </>
}