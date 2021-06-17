require('dotenv').config()
const path = require( 'path' );
const fs = require( 'fs' );
const express = require('express');
const cookieParser = require('cookie-parser');
const router = require("./routes/index");
const cors = require("cors");
const mongoose = require('mongoose');
const errorMid = require('./middleware/error-handle');

const PORT = process.env.PORT || 3000;

const app = express();
// serve static assets
app.get( /\.(js|css|map|ico)$/, express.static( path.resolve( __dirname, '../client/dist/' ) ) );

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(errorMid);


app.use( '*', async ( req, res ) => {
    let indexHTML = fs.readFileSync(
        path.resolve( __dirname, '../client/dist/index.html' ),
        {encoding: 'utf8'})
    
    res.contentType( 'text/html' );
    res.status( 200 );
    return res.send( indexHTML );
} );

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        app.listen(PORT, () => {
            console.log(`Express server started at http://localhost:${PORT} `);
        });
    } catch (e) {
        console.log(e);
    }
}

start();