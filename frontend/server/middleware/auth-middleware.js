const ApiError = require("../exceptions/api-error");
const tokenService = require("../services/token-service");


module.exports = function(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.UnauthorizedError());
        }
        const accessToken = authHeader.split(" ")[1];
        if (!accessToken){
            return next(ApiError.UnauthorizedError());
        }
        const payload = tokenService.validateAccessToken(accessToken);
        if (!payload){
            return next(ApiError.UnauthorizedError());
        }
        req.user = payload;
        next();
    } catch (e){
        return next(ApiError.UnauthorizedError());
    }
}   