"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schemaValidation_1 = require("../middleware/schemaValidation");
const ownerController_1 = __importDefault(require("../controller/ownerController"));
const ownerAuth_1 = __importDefault(require("../middleware/ownerAuth"));
const router = express_1.default.Router();
//Theatre Owner login
router.post("/OwnerInitialLogin", (0, schemaValidation_1.validateSchema)(schemaValidation_1.schema.ownerInitialLoginSchema), ownerController_1.default.InitialLogin);
router.post("/OwnerLogin", (0, schemaValidation_1.validateSchema)(schemaValidation_1.schema.ownerLoginSchema), ownerController_1.default.login);
//Theatre details adding
router.post("/TheatreCreation", ownerAuth_1.default, (0, schemaValidation_1.validateSchema)(schemaValidation_1.schema.theatreCreation), ownerController_1.default.createTheatre);
router.post("/MovieCreation", ownerAuth_1.default, (0, schemaValidation_1.validateSchema)(schemaValidation_1.schema.movieCreation), ownerController_1.default.createMovie);
//movie details uploading
router.post("/MovieSessionUpdate", ownerAuth_1.default, ownerController_1.default.sessionUpdate);
exports.default = router;
