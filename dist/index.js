"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const superAdmin_1 = __importDefault(require("./router/superAdmin"));
const owner_1 = __importDefault(require("./router/owner"));
const user_1 = __importDefault(require("./router/user"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/api", superAdmin_1.default);
app.use("/api/", owner_1.default);
app.use("/api", user_1.default);
db_1.default.sync();
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`);
});
