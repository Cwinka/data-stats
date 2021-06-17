const UserService = require('../services/users-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');


class UserController {
    async registration(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return next(ApiError.BadRequest("Validation faild", errors.array()));
        }
        try {
            const {email, password} = req.body;
            const regInfo = await UserService.registerUser(email, password);
            res.cookie('refreshToken', regInfo.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true});
            res.json(regInfo);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const logInfo = await UserService.loginUser(email, password);
            res.cookie('refreshToken', logInfo.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true});
            res.json(logInfo);
        } catch (e) {
            next(e);
        }
    }
    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await UserService.logoutUser(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }
    async activate(req, res, next) {
        try {
            const activationRandom = req.params.link;
            await UserService.actiateUserByRandom(activationRandom);
            res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }
    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const refInfo = await UserService.refreshToken(refreshToken);
            res.cookie('refreshToken', refInfo.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly:true});
            res.json(refInfo);
        } catch (e) {
            res.clearCookie('refreshToken');
            next(e);
        }
    }
    async validate(req, res, next) {
        res.json({user: req.user});
    }
}

module.exports = new UserController();