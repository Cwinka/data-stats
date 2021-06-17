import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import styles from "./des_tree.style.css"
import service from "../../services/aiService";


export const BasicTrainResults = React.memo( ({result}) =>{
    const predict_map = result.predict_map[Object.keys(result.predict_map)[0]];
    const [moreShown, setMoreShow] = useState(false)

    console.log("[BASIC TRAIN RESULT] rendered");
    return(
        <div className="result">
            <h3>Training result</h3>
            <section>Score: {result.score}</section>
            <button className="btn btn-sm btn-info" onClick={()=> setMoreShow(!moreShown)}>{moreShown ? "Hide": "Show"} additional info</button>
            {moreShown &&
                <>
                    {result.dropped.length > 0 &&
                        <section>
                            <h4>Dropped columns:</h4>
                            <div>
                                {result.dropped.map(pair => 
                                    <p key={`result-${pair[0]}-${pair[1]}`}>{pair[0]} ({pair[1]})</p>
                                )}
                            </div>
                        </section>
                    }
                    {result.new_columns.length > 0 &&
                        <section>
                            <h4>New columns:</h4>
                            <div>
                                {result.result.new_columns.map(column => 
                                    <p key={`result-new-${column}`}>{column}</p>
                                )}
                            </div>
                        </section>
                    }
                    {Object.keys(predict_map).length > 0 &&
                        <section>
                            <h4>Values in predict column was transformed:</h4>
                            <div>
                                {Object.entries(predict_map).map((value, transformed) => 
                                    <p key={`result-predict-transform-${value}`}>{value} to {transformed}</p>
                                )}
                            </div>
                        </section>
                    }
                </>
            }
        </div>
    )
})

function mapStateToProps(state) {
    return {
        filename: state.filedetails.filename,
        columns: state.csv_manager.all_cols,
    }
}
const DesTreeConfigForm = connect(mapStateToProps)( ({filename, columns, callback}) => {
    const [predict, setPreict] = useState("");
    const [test_size, setTestSize] = useState(0.33);
    const [fixed_random, setFixed] = useState(false);
    const [exclude_columns, setExlude] = useState([]);
    const [train_only_columns, setTrainOnly] = useState([]);
    const [max_depth, setDepth] = useState(2);
    useEffect(() => {
        setPreict("");
        setTestSize(0.33);
        setFixed(false);
        setExlude([]);
        setTrainOnly([]);
        setDepth(2);
    }, [filename])

    function train_model(e){
        e.preventDefault();
        if (predict && max_depth && test_size){
            const config = {
                filename, predict, test_size, fixed_random,
                max_depth, exclude_columns, train_only_columns
            }
            service.trainAndGetDecisionTree(config).then(results => {
                callback(results);
            })
        }     
    }
    console.log("[DES TREE CONFOG FORM] rendered");
    return(
        <form>
            <button className="btn btn-sm" type="submit" onClick={train_model}>Train model</button>
            <div className={styles.wrapper}>
                <h5>Model settings</h5>
                <setting className={styles.setting}>
                    Predict column
                    <div name="predict">
                        {columns.map(col_name => 
                            <button type="button" className={`btn btn-sm ${predict === col_name && "btn-success"}`} key={`predict-${col_name}`}  onClick={() => setPreict(col_name)}>{col_name}</button>
                            )}
                    </div>
                </setting>
                <br />
                <setting className={styles.setting}>
                    Enter size of the test sample
                    <input type="number" onChange={(e) => setTestSize(e.target.value)} step="0.01" max="1" min="0.05" value={test_size}/>
                </setting>
                <br />
                <setting className={styles.setting}>
                    Maximum depth of the tree
                    <input type="number" onChange={(e) => setDepth(e.target.value)} max="10" min="1" value={max_depth}/>
                </setting>
                <br />
                <setting className={styles.setting}>
                    Method to choose values in samples:
                    <button type="button" className="btn btn-sm" onClick={(e) => setFixed(!fixed_random)}>{fixed_random ? "Fixed": "Random"}</button>
                </setting>
                <br />
                {!train_only_columns.length && 
                    <setting className={styles.setting}>
                        Exclude these columns [OPTIONAL]: 
                        <div>
                        {columns.map(col_name => {
                            const in_ = exclude_columns.indexOf(col_name) !== -1;
                            if (col_name === predict) { if (in_){ setExlude(exclude_columns.filter(elem => elem !== col_name))} return}
                            return <button type="button" key={`exclude-${col_name}`} className={`btn btn-sm ${ in_ ? "btn-danger": ""}`}
                                        onClick={() => {
                                            if (in_){
                                                setExlude(exclude_columns.filter(elem => elem !== col_name));
                                            }else{
                                                setExlude(exclude_columns.concat([col_name]));
                                            }}}>
                                            {col_name}
                                    </button>
                        })}
                        </div>
                    </setting>
                }
                <br />
                {!exclude_columns.length && 
                    <setting className={styles.setting}>
                        Train only on these columns [OPTIONAL]:
                        <div>
                            {columns.map(col_name => {
                                const in_ = train_only_columns.indexOf(col_name) !== -1;
                                if (col_name === predict) { if (in_){ setTrainOnly(train_only_columns.filter(elem => elem !== col_name))} return}
                                return <button type="button" key={`include-${col_name}`} className={`btn btn-sm ${ in_ ? "btn-success": ""}`}
                                            onClick={() => {
                                                setExlude([]);
                                                if (in_){
                                                    setTrainOnly(train_only_columns.filter(elem => elem !== col_name));
                                                }else{
                                                    setTrainOnly(train_only_columns.concat([col_name]));
                                                }}}>
                                                {col_name}
                                        </button>
                            })}
                        </div>
                    </setting>
                }
            </div>
        </form>
    )
})


export const DesTree = React.memo( () => {
    const [resultShown, setResultShown] = useState(false);
    const [shown, setShown] = useState(false);
    const [result, setResult] = useState({})
    const [error, setError] = useState("");

    const fetch_train_result =  useCallback( results =>{
        const {error, result} = results;
        if (error){
            setError(error);
            setResult({});
        } else {
            setError("");
            setResult(result);
        }
    })


    console.log("[DES TREE] rendered");
    return(
        <div className="decision-tree">
            Decision tree classifier
            <button className="btn btn-sm" onClick={() => setShown(!shown)}>{shown ? "Hide": "Show"} settings</button>
            {Object.keys(result).length !== 0 && 
                <button className="btn btn-sm btn-info" onClick={() => setResultShown(!resultShown)} >{resultShown ? "Hide":" Show"} train result</button>
            }
            {error && <div style={{color: "red"}} >{error}</div>}
            {resultShown && Object.keys(result).length !==0 &&
                <BasicTrainResults result={result} />
            }
            {shown && 
                <DesTreeConfigForm callback={fetch_train_result}/>
            }
        </div>
    )
})