"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateTokenMiddleWare = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const config_1 = require("../config/config");
const authenticateTokenMiddleWare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // "Bearer <token>"
    if (!token) {
        res.status(401).json({ message: 'Authentication token is required.' });
        return;
    }
    try {
        // Verifies the token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        // Fetch user information from the database to ensure the user still exists
        const user = yield userModel_1.default.findById(decoded.id);
        if (!user) {
            res.status(404).json({ message: 'User not found. Authentication failed.' });
            return;
        }
        // Attach user ID to the request object
        req.authenticatedUserId = user.id;
        next(); // Proceed to the next middleware/controller
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
});
exports.authenticateTokenMiddleWare = authenticateTokenMiddleWare;
