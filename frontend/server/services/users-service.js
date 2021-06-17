const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const MailService = require('./mail-service');
const TokenService = require('./token-service');
const UserDTO = require("../models/dto/user");
const ApiError = require('../exceptions/api-error');

SALT = +(process.env.BCRYPT_SALT);

class UserService {
    async registerUser(email, password) {
        if (await UserModel.findOne({ email })) {
            throw ApiError.BadRequest(`User with email ${email} is already exists`)
        }

        const hashedP = await bcrypt.hash(password, SALT);
        const activationRandom = uuid.v4();
        const user = await UserModel.create({ email, psw: hashedP, activationRandom:activationRandom });

        await MailService.sendActivationMailTo(email, activationRandom);

        return await this._getTokensAndSaveThem(user);
    }

    async _getTokensAndSaveThem(user) {
        const dto = new UserDTO(user);
        const tokens = await TokenService.generateTokens({ ...dto });
        await TokenService.saveRefreshToken(dto.id, tokens.refreshToken);

        return { ...tokens, user: {...dto} }
    }

    async actiateUserByRandom(activationRandom){
        const user = await UserModel.findOne({activationRandom})
        if (!user){
            throw ApiError.BadRequest("Activation link is incorrect");
        }
        user.isActivated = true;
        await user.save();
    }

    async loginUser(email, password){
        const user = await UserModel.findOne({ email })
        if (!user) {
            throw ApiError.BadRequest(`Incorrect email or passsword`);
        }
        const isPasswordsSame = await bcrypt.compare(password, user.psw)
        if (!isPasswordsSame){
            throw ApiError.BadRequest(`Incorrect email or passsword`);
        }
        return await this._getTokensAndSaveThem(user);
    }
    async logoutUser(refreshToken){
        return await TokenService.removeToken(refreshToken);
    }
    async refreshToken(refreshToken){
        if (!(refreshToken)){
            throw ApiError.UnauthorizedError();
        }
        const payload = TokenService.validateRefreshToken(refreshToken);
        const tokenIdDB = await TokenService.findRefreshToken(refreshToken);
        if (!payload || !tokenIdDB){
            throw ApiError.Forbidden();
        }
        const user = await UserModel.findById(payload.id);
        if (!user){
            throw ApiError.UnauthorizedError();
        }
        return await this._getTokensAndSaveThem(user);
    }
}
module.exports = new UserService();