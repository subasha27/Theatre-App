import express from "express";
import { validateSchema ,schema} from "../middleware/schemaValidation";
import ownerCon from "../controller/ownerController";
import authenticateHandler from "../middleware/ownerAuth";
const router = express.Router();


//Theatre Owner login
router.post("/OwnerInitialLogin",validateSchema(schema.ownerInitialLoginSchema),ownerCon.InitialLogin);
router.post("/OwnerLogin",validateSchema(schema.ownerLoginSchema),ownerCon.login);


//Theatre details adding
router.post("/TheatreCreation",authenticateHandler,validateSchema(schema.theatreCreation),ownerCon.createTheatre);
router.post("/MovieCreation",authenticateHandler,validateSchema(schema.movieCreation),ownerCon.createMovie);

//movie details uploading
router.post("/MovieSessionUpdate",authenticateHandler,ownerCon.sessionUpdate);



export default router