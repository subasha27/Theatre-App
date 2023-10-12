"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.validateSchema = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
function validateSchema(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return res.status(400).json({ error: errorMessage });
        }
        next();
    };
}
exports.validateSchema = validateSchema;
class Schema {
    constructor() {
        this.adminSchema = joi_1.default.object({
            name: joi_1.default.string().min(3).max(15).required(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(4).max(8).required()
        });
        this.adminLoginSchema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().required()
        });
        this.ownerCreationSchema = joi_1.default.object({
            name: joi_1.default.string().min(3).max(15).required(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(4).max(8).required()
        });
        this.ownerInitialLoginSchema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(4).max(8).required(),
            newPassword: joi_1.default.string().min(4).max(8).required()
        });
        this.ownerLoginSchema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(4).max(8).required()
        });
        this.theatreCreation = joi_1.default.object({
            theatreName: joi_1.default.string().required(),
            totalScreen: joi_1.default.number().required(),
            capacity: joi_1.default.number().required(),
            location: joi_1.default.string().required(),
            bookingLimit: joi_1.default.number().required()
        });
        this.movieCreation = joi_1.default.object({
            theatreName: joi_1.default.string().required(),
            screenName: joi_1.default.string().required(),
            movie: joi_1.default.string().required(),
            date: joi_1.default.date().required(),
            totalSession: joi_1.default.number().required(),
            totalSeats: joi_1.default.number().required(),
            budgetClass: joi_1.default.number().required(),
            executiveClass: joi_1.default.number().required(),
            firstClass: joi_1.default.number().required(),
        });
        this.userRegisterSchema = joi_1.default.object({
            name: joi_1.default.string().min(3).max(15).required(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(4).max(8).required()
        });
        this.userLoginSchema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(4).max(8).required()
        });
        this.theatreLocationSchema = joi_1.default.object({
            location: joi_1.default.string().required()
        });
        this.movieListSchema = joi_1.default.object({
            theatreId: joi_1.default.number().required()
        });
        this.bookingDataSchema = joi_1.default.object({
            movieId: joi_1.default.number().integer().required(),
            tickets: joi_1.default.array()
                .items(joi_1.default.object({
                budgetClass: joi_1.default.number().integer().min(0),
                executiveClass: joi_1.default.number().integer().min(0),
                firstClass: joi_1.default.number().integer().min(0)
            }))
                .min(1)
                .max(6)
                .required(),
        });
    }
}
const schema = new Schema();
exports.schema = schema;
