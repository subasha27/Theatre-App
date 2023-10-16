"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schemaValidation_1 = require("../middleware/schemaValidation");
const superAdminCon_1 = __importDefault(require("../controller/superAdminCon"));
const adminAuth_1 = __importDefault(require("../middleware/adminAuth"));
const router = express_1.default.Router();
router.post('/AdminRegister', (0, schemaValidation_1.validateSchema)(schemaValidation_1.schema.adminSchema), superAdminCon_1.default.create);
router.post('/AdminLogin', (0, schemaValidation_1.validateSchema)(schemaValidation_1.schema.adminLoginSchema), superAdminCon_1.default.login);
router.post('/TheatreOwnerCreation', adminAuth_1.default, (0, schemaValidation_1.validateSchema)(schemaValidation_1.schema.ownerCreationSchema), superAdminCon_1.default.ownerCreation);
exports.default = router;
