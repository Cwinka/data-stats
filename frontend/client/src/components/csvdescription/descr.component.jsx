import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import service from "../../services/statisticService";
import styles from "./description.style.css";

function mStP(state) {
    return {
        filename: state.filedetails.filename,
        prev: state.filedetails.prev
    }
}

export const CSVDescription = connect(mStP)( ({filename, prev}) => {
    const [csv_d, setDescr] = useState({})
    const [shown, setShown] = useState(false)

    useEffect(() => {
        if (filename != prev) {
            service.get_csv_stat_description(filename).then(response => {
                setDescr(response.data.descr);
            })
        }
    }, [filename])
    
    console.log("Csv details rendered");
    return(
        <div className="details-block description">
            <div className="spread-title">
                <h4>Descriptive statistics</h4>
                <button className="warn-button btn btn-sm btn-outline-warning"
                        onClick={() => setShown(!shown)}>
                        {shown ? "Hide": "Show"}
                </button>
            </div>
                {shown && Object.keys(csv_d).length !== 0 &&
                    <div className={styles.wrapper_scr}>
                        <table className="table table-sm">
                            <thead className="thead-dark">
                                <th scope="col"></th>
                                {Object.keys(csv_d).map(column => (
                                        <th scope="col" key={column}>
                                            {column}
                                        </th>
                                ))}
                            </thead>
                            <tbody>
                                {Object.keys(csv_d[Object.keys(csv_d)[0]]).map(field => (
                                    <tr key={field}>
                                        <td>{field}</td>
                                        {Object.keys(csv_d).map(column => (
                                            <td key={`${field} ${column}`}>{csv_d[column][field]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
        </div>
    )
})