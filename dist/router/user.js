"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schemaValidation_1 = require("../middleware/schemaValidation");
const userController_1 = __importDefault(require("../controller/userController"));
const userAuth_1 = __importDefault(require("../middleware/userAuth"));
const router = express_1.default.Router();
//user login 
router.post('/UserRegister', userController_1.default.create);
router.post('/UserLogin', userController_1.default.login);
router.get("/Theatre", userAuth_1.default, (0, schemaValidation_1.validateSchema)(schemaValidation_1.schema.theatreLocationSchema), userController_1.default.getTheatre);
router.get("/MovieList", userAuth_1.default, (0, schemaValidation_1.validateSchema)(schemaValidation_1.schema.movieListSchema), userController_1.default.getList);
router.post("/Booking", (0, schemaValidation_1.validateSchema)(schemaValidation_1.schema.bookingDataSchema), userAuth_1.default, userController_1.default.booking);
exports.default = router;
