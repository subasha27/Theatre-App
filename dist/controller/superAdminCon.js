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
const superAdminModel_1 = require("../model/superAdminModel");
const modelMethods_1 = __importDefault(require("../model/modelMethods"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ownerModel_1 = __importDefault(require("../model/ownerModel"));
const sendEmail_1 = __importDefault(require("../helpers/sendEmail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SuperAdminCon {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminData = req.body;
                const hashedPass = yield bcrypt_1.default.hash(adminData.password, 10);
                adminData.password = hashedPass;
                const existingData = yield modelMethods_1.default.findOne(superAdminModel_1.SuperAdmins, { "email": req.body.email });
                if (existingData) {
                    return res.status(403).send({ message: "Admin Already Exists" });
                }
                const adminCreate = yield modelMethods_1.default.createUser(superAdminModel_1.SuperAdmins, adminData);
                const adminId = adminCreate.id;
                res.status(200).send({ message: "Admin Created Successfully", adminId });
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "Admin Creation Error", err });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminData = req.body;
                const existingData = yield modelMethods_1.default.findOne(superAdminModel_1.SuperAdmins, { "email": req.body.email });
                if (!existingData)
                    return res.status(404).send({ message: "Admin does not Exists" });
                else {
                    const dehashPass = yield bcrypt_1.default.compare(adminData.password, existingData.password);
                    if (dehashPass) {
                        const token = jsonwebtoken_1.default.sign(adminData.email, process.env.superAdminSecretKey);
                        return res.status(200).send({ message: "login Successfully", token });
                    }
                    else {
                        return res.status(401).send({ message: "Invalid Password" });
                    }
                }
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "Login Error", err });
            }
        });
    }
    ownerCreation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const handlerData = req.body;
                const existingData = yield modelMethods_1.default.findOne(ownerModel_1.default, { "email": req.body.email });
                if (existingData)
                    return res.status(403).send({ message: "Handler Already Exists" });
                const handlerCreate = yield modelMethods_1.default.createUser(ownerModel_1.default, handlerData);
                const handlerId = handlerCreate.id;
                const subject = "Account Created";
                const text = `New Accounnt Is created \n id : ${handlerId}\npassword : ${handlerData.password}`;
                yield sendEmail_1.default.sendMail(handlerData.email, subject, text);
                return res.status(200).send({ message: "handler Created Successfully", handlerId });
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "Handler creation Error", err });
            }
        });
    }
}
exports.default = new SuperAdminCon;
