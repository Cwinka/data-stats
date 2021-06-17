const Router = require('express').Router;
const userController = require("../controllers/user");
const {body} = require('express-validator');
const router = new Router();
const authMiddleware = require('../middleware/auth-middleware')

router.post("/reg",
    body('email').isEmail(),
    body('password').isLength({min:6, max:32}),
    userController.registration);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);

router.get("/validate", authMiddleware, userController.validate);


module.exports = router;