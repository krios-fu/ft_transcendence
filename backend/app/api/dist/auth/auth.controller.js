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
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../decorators/public.decorator");
const fortytwo_auth_guard_1 = require("./guard/fortytwo-auth.guard");
const request_payload_interface_1 = require("../interfaces/request-payload.interface");
;
let AuthController = class AuthController {
    constructor(authService, logger) {
        this.authService = authService;
        this.logger = logger;
    }
    async authFromFT(req, res) {
        if (req.user === null) {
            throw new common_1.HttpException('fortytwo strategy did not provide user profile to auth service', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return this.authService.authUser(req.user, res);
    }
    async refreshToken(req, res) {
        const refreshToken = req.cookies['refresh_token'];
        const authUser = req.query.user;
        let authPayload;
        if (authUser === null || refreshToken === null) {
            throw new common_1.HttpException('User not authenticated', common_1.HttpStatus.UNAUTHORIZED);
        }
        try {
            authPayload = await this.authService.refreshToken(refreshToken, authUser);
        }
        catch (err) {
            this.logger.error(`Caught exception in refreshToken controller: ${err}`);
            res.clearCookie('refresh_cookie');
            throw new common_1.HttpException(err, common_1.HttpStatus.UNAUTHORIZED);
        }
        return authPayload;
    }
    logout(req, res) {
        this.authService.logout(req.username, res);
    }
};
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('42'),
    (0, common_1.UseGuards)(fortytwo_auth_guard_1.FortyTwoAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authFromFT", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('token'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof request_payload_interface_1.IRequestUser !== "undefined" && request_payload_interface_1.IRequestUser) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        common_1.Logger])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map