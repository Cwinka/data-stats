import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMid from 'redux-saga';

import { rootReducer } from "./redux/rootReducer";
import rootSaga from './redux/sagas/sagaWatcher';
import {App} from './components/app';

const saga = createSagaMid();
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancer(
  applyMiddleware(
    thunk, saga
    )
  ));

saga.run(rootSaga);


ReactDOM.hydrate(
    <React.StrictMode>
      <Provider store={store}>
        
          <Router>
            <App />
          </Router>
        
      </Provider>
    </React.StrictMode>,
    document.querySelector('#root')
);

