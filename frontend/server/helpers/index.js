const fs = require( 'fs' );
const path = require( 'path' );
const React = require( 'react' );
const {Provider} = require('react-redux')
const ReactDOMServer = require( 'react-dom/server' );
const { StaticRouter, matchPath } = require( 'react-router-dom' );
const {createStore} = require('redux')
const { rootReducer } = require("../../src/redux/rootReducer");
const { App } = require( '../../src/components/app' );

const getRndAPP = (req) => {
    let indexHTML = fs.readFileSync( path.resolve( __dirname, '../../dist/index.html' ), {
        encoding: 'utf8',
    } );
    
    const store = createStore(rootReducer)

    let appHTML = ReactDOMServer.renderToString(
        <Provider store={store}>
            <StaticRouter location={ req.originalUrl }>
                <App />
            </StaticRouter>
        </Provider>
    );

    return indexHTML.replace( '<div id="root"></div>', `<div id="root">${ appHTML }</div>` );
}
module.exports.getApp = getRndAPP;