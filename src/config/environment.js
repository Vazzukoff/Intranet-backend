"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    // Server
    PORT: zod_1.z.string().default("3000"),
    // Database
    DB_HOST: zod_1.z.string(),
    DB_PORT: zod_1.z.string(),
    DB_NAME: zod_1.z.string(),
    DB_USER: zod_1.z.string(),
    DB_PASSWORD: zod_1.z.string(),
});
const env = envSchema.safeParse(process.env);
if (!env.success) {
    console.error("Invalid environment variables:", (_a = env.error) === null || _a === void 0 ? void 0 : _a.format());
    throw new Error("Invalid environment variables");
}
exports.config = {
    // Server
    PORT: parseInt(env.data.PORT, 10),
    //Database
    DB_HOST: env.data.DB_HOST,
    DB_PORT: env.data.DB_PORT,
    DB_NAME: env.data.DB_NAME,
    DB_USER: env.data.DB_USER,
    DB_PASSWORD: env.data.DB_PASSWORD,
};
