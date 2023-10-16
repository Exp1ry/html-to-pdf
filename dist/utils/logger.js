"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_transport_1 = __importDefault(require("winston-transport"));
const Colors = {
    info: "\x1b[36m",
    error: "\x1b[31m",
    warn: "\x1b[33m",
    verbose: "\x1b[43m",
};
class ConsoleLogger extends winston_transport_1.default {
    constructor() {
        super();
    }
    log(info, callback) {
        const { level, message, stack, } = info;
        console.log(
        //@ts-ignore
        `${Colors[level]}${level}\t${message}\x1b[0m`, stack ? "\n" + stack : "");
        if (callback) {
            callback();
        }
    }
}
winston_1.default.configure({
    transports: [new ConsoleLogger()],
});
exports.default = winston_1.default;
