const express = require( 'express' );
const {getApp} = require("./helpers")
const path = require( 'path' );

const app = express();

const routes = require( './routes' );

// serve static assets
app.get( /\.(js|css|map|ico)$/, express.static( path.resolve( __dirname, '../dist' ) ) );



// for any other requests, send `index.html` as a response
app.use( '*', async ( req, res ) => {

    const html = getApp(req);

    res.contentType( 'text/html' );
    res.status( 200 );

    return res.send( html );
} );

app.listen( '3000', () => {
    console.log( 'Express server started at http://localhost:3000' );
} );