const {getApp} = require("../helpers")

const router = require('express').Router()

router.post("/auth", async (req, res) => {
    console.log(res);
    const html = getApp(req)

    res.contentType( 'text/html' );
    res.status( 200 );

    return res.send( html );
});


module.exports.authRouter = router;