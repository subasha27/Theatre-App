import express from "express";
import { validateSchema ,schema} from "../middleware/schemaValidation";
import superAdminCon from "../controller/superAdminCon";
import authenticateAdmin from "../middleware/adminAuth";
const router = express.Router();

router.post('/AdminRegister',validateSchema(schema.adminSchema),superAdminCon.create);
router.post('/AdminLogin',validateSchema(schema.adminLoginSchema),superAdminCon.login);
router.post('/TheatreOwnerCreation',authenticateAdmin,validateSchema(schema.ownerCreationSchema),superAdminCon.ownerCreation);





export default router