import React from 'react';
import { Link } from 'react-router-dom'

import { URLS } from '../../config'

export const Nav = () => {
    console.log("Nav render");
    return <>
        <nav className="navigation">
            <ul>
                <li><Link to={URLS.HOME}>Home</Link></li>
                <li><Link to={URLS.FILE_ANALYSE}>Analitics</Link></li>
            </ul>
        </nav>
    </>
}