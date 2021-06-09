import '../../styles/global.scss';
import '../../styles/bootstrap.min.css';
import React from 'react';
import { Switch, Route } from "react-router-dom";

import {URLS} from "../../config"
import {LoginPage} from '../../pages/login'
import {HomePage} from '../../pages/home'
import {DataBox} from '../../pages/analitics'
import {MyAccount} from '../../pages/myaccount'
import {ErrorPage} from "../../pages/error"
import {Nav} from "../nav"
import {MasterPanel} from "../masterpanel"
import {Loader} from '../loader'

import {TryLoginWithCookie} from "../../helpers/tryLogin"
import {PrivateRoute} from "../../helpers/PrivateRoute"

export function App() {
  return <>
    <Nav />
    <MasterPanel/>
    <div className="main main-panels">
      <TryLoginWithCookie>
        <Loader>
          <Switch>
            <Route path={URLS.HOME} exact component={HomePage}/>
            <Route path={URLS.LOGIN} exact component={LoginPage}/>
            <PrivateRoute path={URLS.FILE_ANALYSE} exact component={DataBox}/>
            <PrivateRoute path={URLS.MY_ACCOUNT} exact component={MyAccount}/>
            <Route path='*' component={ErrorPage}/>
          </Switch>
        </Loader>
      </TryLoginWithCookie>
    </div>
  </>
}