"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const refresh_token_entity_1 = require("./entity/refresh-token.entity");
const refresh_token_repository_1 = require("./repository/refresh-token.repository");
const typeorm_1 = require("@nestjs/typeorm");
const token_error_enum_1 = require("./enum/token-error.enum");
let AuthService = class AuthService {
    constructor(userService, jwtService, refreshTokenRepository, logger) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.logger = logger;
    }
    signJwt(username) {
        return this.jwtService.sign({
            data: { username: username },
        });
    }
    async authUser(userProfile, res) {
        const username = userProfile.username;
        let loggedUser;
        let tokenEntity;
        loggedUser = await this.userService.findOne(username);
        if (loggedUser === null) {
            loggedUser = await this.userService.postUser(userProfile);
        }
        tokenEntity = await this.refreshTokenRepository.findOne({
            relations: { authUser: true },
            where: {
                authUser: { username: loggedUser.username }
            }
        });
        if (tokenEntity === null) {
            const newToken = new refresh_token_entity_1.RefreshTokenEntity({
                authUser: loggedUser,
                expiresIn: new Date(Date.now() + (3600 * 24 * 7))
            });
            tokenEntity = await this.refreshTokenRepository.save(newToken);
        }
        res.cookie('refresh_token', tokenEntity.token, {
            httpOnly: true,
            maxAge: 3600 * 24 * 7,
            sameSite: 'none',
            secure: true,
        });
        return {
            'accessToken': this.signJwt(username),
            'username': username,
        };
    }
    async refreshToken(refreshToken, username) {
        let tokenEntity;
        try {
            tokenEntity = await this.getTokenByUsername(username);
        }
        catch (err) {
            this.logger.error(`Caught exception in refreshToken: ${err}`);
            throw err;
        }
        if (tokenEntity.token != refreshToken) {
            throw token_error_enum_1.TokenError.TOKEN_INVALID;
        }
        else if (tokenEntity.expiresIn.getTime() < Date.now()) {
            await this.refreshTokenRepository.delete(tokenEntity);
            throw token_error_enum_1.TokenError.TOKEN_EXPIRED;
        }
        return {
            'accessToken': this.signJwt(username),
            'username': username,
        };
    }
    async logout(username, res) {
        let tokenEntity;
        try {
            tokenEntity = await this.getTokenByUsername(username);
        }
        catch (err) {
            this.logger.error(`Caught exception in logout: ${err} \
                (user logged out without a valid session)`);
        }
        await this.refreshTokenRepository.delete(tokenEntity);
        res.clearCookie('refresh_token');
    }
    async getTokenByUsername(username) {
        let tokenEntity;
        let userEntity;
        userEntity = await this.userService.findOne(username);
        if (userEntity === null) {
            throw token_error_enum_1.TokenError.NO_TOKEN_OR_USER;
        }
        tokenEntity = await this.refreshTokenRepository.findOne({
            relations: { authUser: true },
            where: {
                authUser: { username: userEntity.username }
            }
        });
        if (tokenEntity === null) {
            throw token_error_enum_1.TokenError.NO_TOKEN_OR_USER;
        }
        return tokenEntity;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(refresh_token_entity_1.RefreshTokenEntity)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService, typeof (_a = typeof refresh_token_repository_1.RefreshTokenRepository !== "undefined" && refresh_token_repository_1.RefreshTokenRepository) === "function" ? _a : Object, common_1.Logger])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map