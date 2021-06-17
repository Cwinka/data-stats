import React from 'react';
import { Link } from 'react-router-dom'
import styles from "./nav.style.css";
import { URLS } from '../../config'

export const Nav = () => {
    console.log("[NAV] rendered");
    return <>
        <nav className={styles.navigation}>
            <ul>
                <li><Link to={URLS.HOME}>Home</Link></li>
                <li><Link to={URLS.FILE_ANALYSE}>Analitics</Link></li>
            </ul>
        </nav>
    </>
}