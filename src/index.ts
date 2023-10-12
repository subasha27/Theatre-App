import express from "express";
import sequelize from "./config/db";
import adminRoute from "./router/superAdmin";
import ownerRoute from "./router/owner";
import userRoute from "./router/user";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", adminRoute);
app.use("/api/",ownerRoute);
app.use("/api",userRoute);

sequelize.sync();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`)
})