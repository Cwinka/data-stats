const jwt = require('jsonwebtoken');
const TokenModel = require("../models/token");


const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES;
const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES;
const TOKEN_ALGORITHM = process.env.TOKEN_ALGORITHM;

class TokenService {
    
    async generateTokens(payload){
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {expiresIn: TOKEN_EXPIRES, algorithm: TOKEN_ALGORITHM});
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: REFRESH_TOKEN_EXPIRES, algorithm: TOKEN_ALGORITHM});
        return {accessToken, refreshToken}
    }

    async saveRefreshToken(userId, refreshToken){
        const existsToken = await TokenModel.findOne({user: userId});
        if (existsToken){
            existsToken.refreshToken = refreshToken;
            return await existsToken.save();
        }
        const token = await TokenModel.create({user: userId, refreshToken});
        return token;
    }
    async removeToken(refreshToken){
        return await TokenModel.deleteOne({refreshToken});
    }
    async findRefreshToken(refreshToken){
        return await TokenModel.findOne({refreshToken});
    }

    validateAccessToken(token){
        try{
            return jwt.verify(token, JWT_ACCESS_SECRET);
        } catch (e){
            return null
        }
    }
    validateRefreshToken(token){
        try{
            return jwt.verify(token, JWT_REFRESH_SECRET);
        } catch (e){
            console.log(e);
            return null
        }
    }
    
}

module.exports = new TokenService();