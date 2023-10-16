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
const axios_1 = __importDefault(require("axios"));
// to verify secret id
const secretKeyProtected = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const secretKey = req.header("secret");
    const appId = req.header("appId");
    const version = req.header("version");
    if (!secretKey || !appId || !version) {
        return res
            .status(401)
            .json({ msg: "Error, send secret key, appId, and version" });
    }
    else {
        try {
            const formData = new URLSearchParams();
            formData.set("secret", secretKey);
            formData.set("appId", appId);
            formData.set("version", version);
            const { data } = yield axios_1.default.post(`https://${appId}.${process.env.VALIDATOR_API_URL}`, formData, {
                headers: Object.assign({}, formData.headers),
            });
            if (data.success) {
                req.appId = appId;
                next();
            }
            else {
                return res.status(401).json({
                    msg: "Credential error: Please verify your appId and your secret key.",
                });
            }
        }
        catch (error) {
            next(err);
            return res.status(500).json({
                msg: "Credential error: Please verify your appId and your secret key.",
            });
        }
    }
});
exports.default = secretKeyProtected;
