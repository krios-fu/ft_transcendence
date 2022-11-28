"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenError = void 0;
var TokenError;
(function (TokenError) {
    TokenError["NO_TOKEN_OR_USER"] = "No token available for user";
    TokenError["TOKEN_EXPIRED"] = "Token has expired";
    TokenError["TOKEN_INVALID"] = "Token not assigned to current user";
    TokenError["TOKEN_BLACKLISTED"] = "Token currrently blacklisted from server";
})(TokenError = exports.TokenError || (exports.TokenError = {}));
//# sourceMappingURL=token-error.enum.js.map