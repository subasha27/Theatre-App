import express from "express";
import { validateSchema,schema } from "../middleware/schemaValidation";
import UserController from "../controller/userController";
import authenticateUser from "../middleware/userAuth";
import userController from "../controller/userController";
const router = express.Router();

//user login 
router.post('/UserRegister',UserController.create);
router.post('/UserLogin',UserController.login);

router.get("/Theatre",authenticateUser,validateSchema(schema.theatreLocationSchema),UserController.getTheatre);

router.get("/MovieList/:theatreId",authenticateUser,UserController.getList);
router.post("/Booking",validateSchema(schema.bookingDataSchema),authenticateUser,UserController.booking);

router.post("/Cancelling/:id",authenticateUser,userController.cancellation);



export default router