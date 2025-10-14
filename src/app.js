"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cors_middleware_1 = require("./middlewares/cors.middleware");
const tasks_routes_1 = __importDefault(require("./routes/tasks.routes"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const files_routes_1 = __importDefault(require("./routes/files.routes"));
const path_1 = __importDefault(require("path"));
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(cors_middleware_1.corsMiddleware);
// Rutas públicas (sin autenticación)
app.use("/api/auth", auth_routes_1.default);
// Rutas protegidas (con autenticación)
app.use("/api/tasks", auth_middleware_1.requireAuth, tasks_routes_1.default);
app.use("/api/users", auth_middleware_1.requireAuth, user_routes_1.default);
app.use("/api/files", auth_middleware_1.requireAuth, files_routes_1.default);
app.use("/api/upload", auth_middleware_1.requireAuth, upload_routes_1.default);
app.use('/api/uploads', express_1.default.static(path_1.default.join(__dirname, '/uploads')));
console.log("🛣️ Rutas registradas en Express:");
console.log((0, express_list_endpoints_1.default)(app));
exports.default = app;
