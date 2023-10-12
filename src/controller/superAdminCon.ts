import { Request, Response } from "express";
import { SuperAdmins } from "../model/superAdminModel";
import SuperAdminMethods from "../model/modelMethods";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import Owners from "../model/ownerModel";
import EmailService from "../helpers/sendEmail";
import dotenv from "dotenv";
dotenv.config();


class SuperAdminCon {

    async create(req: Request, res: Response) {
        try {
            const adminData = req.body;
            const hashedPass = await bcrypt.hash(adminData.password, 10)
            adminData.password = hashedPass
            const existingData = await SuperAdminMethods.findOne(SuperAdmins,{"email":req.body.email});
            if (existingData) {
                return res.status(403).send({ message: "Admin Already Exists" });
            }
            const adminCreate = await SuperAdminMethods.createUser(SuperAdmins,adminData)
            const adminId = adminCreate.id
            res.status(200).send({ message: "Admin Created Successfully", adminId })
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: "Admin Creation Error", err })
        }
    }

    async login(req: Request, res: Response) {
        try {
            const adminData = req.body;
            const existingData = await SuperAdminMethods.findOne(SuperAdmins,{"email":req.body.email});
            if (!existingData) return res.status(404).send({ message: "Admin does not Exists" });

            else {
                const dehashPass = await bcrypt.compare(adminData.password, existingData.password)
                if (dehashPass) {
                    const token = jwt.sign(adminData.email, process.env.superAdminSecretKey as string);
                    return res.status(200).send({ message: "login Successfully", token })
                } else {
                    return res.status(401).send({ message: "Invalid Password" });
                }
            }
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: "Login Error", err })
        }
    }

    async ownerCreation(req: Request, res: Response) {
        try {
            const handlerData = req.body;
            const existingData = await SuperAdminMethods.findOne(Owners,{"email":req.body.email});
            if (existingData) return res.status(403).send({ message: "Handler Already Exists" });
            const handlerCreate = await SuperAdminMethods.createUser(Owners,handlerData)
            const handlerId = handlerCreate.id
            const subject = "Account Created";
            const text = `New Accounnt Is created \n id : ${handlerId}\npassword : ${handlerData.password}`
            await EmailService.sendMail(handlerData.email, subject, text)
            return res.status(200).send({ message: "handler Created Successfully", handlerId })
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: "Handler creation Error", err })
        }
    }

}

export default new SuperAdminCon