"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdmins = void 0;
const db_1 = __importDefault(require("../config/db"));
const sequelize_1 = require("sequelize");
class SuperAdmins extends sequelize_1.Model {
}
exports.SuperAdmins = SuperAdmins;
SuperAdmins.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db_1.default,
    modelName: "SuperAdmins",
    timestamps: true
});
