import React, { useEffect } from 'react';
import { Switch, Route } from "react-router-dom";
import styles from "./app.style.css";
import { URLS } from "../../config"
import { LoginPage } from '../../pages/login'
import { HomePage } from '../../pages/home'
import { Analitycs } from '../../pages/analitics'
import { MyAccount } from '../../pages/myaccount'
import { ErrorPage } from "../../pages/error"
import { Nav } from "../nav"
import { MasterPanel } from "../masterpanel"
import { Footer } from "../footer"
import { PageLoader } from '../loader'

import { useDispatch } from 'react-redux';
import { checkCred } from "../../redux/authReducer"
import { AuthRequered } from "../../helpers/authRequered";
import { hidePageLoader } from '../../redux/loaderReducer';

export function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkCred());
    } else {
      dispatch(hidePageLoader());
    }
  }, [])

  return <>
    <PageLoader>
      <Nav />
      <MasterPanel />
      <div className={`${styles.main} ${styles.main_panels}`}>
        <Switch>
          <Route path={URLS.HOME} exact component={HomePage} />
          <Route path={URLS.LOGIN} exact component={LoginPage} />
          <AuthRequered>
            <Route path={URLS.FILE_ANALYSE} exact component={Analitycs} />
            <Route path={URLS.MY_ACCOUNT} exact component={MyAccount} />
          </AuthRequered>
          <Route path='*' component={ErrorPage} />
        </Switch>
      </div>
      <Footer/>
    </PageLoader>
  </>
}