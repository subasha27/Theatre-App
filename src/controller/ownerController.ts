import { Request, Response } from "express";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import Owners from "../model/ownerModel";
import { Theatres, Movies, MoviePrices } from "../model/theatreModel";
import SuperAdminMethods from "../model/modelMethods";
import dotenv from "dotenv";
dotenv.config();



class OwnerCon {

    async InitialLogin(req: Request, res: Response) {
        try {
            const ownerData = req.body;
            const existingData = await SuperAdminMethods.findOne(Owners, { "email": req.body.email });
            if (!existingData) {
                return res.status(403).send({ message: "owner does not Exists" });
            }

            if (existingData && existingData.firstLogin == false) {
                return res.send({ message: "owner already did the initial Login" })
            }

            const hashedPass = await bcrypt.hash(ownerData.newPassword, 10)
            await SuperAdminMethods.update(Owners, { password: hashedPass, firstLogin: false }, { 'email': ownerData.email })
            return res.status(200).send({ message: "owner Initial login Successfully", })
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: "Admin Creation Error", err })
        }
    }

    async login(req: Request, res: Response) {
        try {
            const ownerData = req.body;
            const existingData = await SuperAdminMethods.findOne(Owners, { "email": req.body.email });
            if (!existingData) {
                return res.status(404).send({ message: "owner does not Exists" });
            }

            if (existingData && existingData.firstLogin == true) {
                return res.send({ message: "Complete the initial Login first" })
            }
            else {
                const dehashPass = await bcrypt.compare(ownerData.password, existingData.password)
                if (dehashPass) {
                    const token = jwt.sign(existingData.id, process.env.ownerSecretKey as string);
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


    async createTheatre(req: Request, res: Response) {
        try {
            const theatreData = req.body;
            const handlerId = (req as any).owner
            theatreData.theatreId = handlerId;
            const existingData = await SuperAdminMethods.findOne(Theatres, { "theatreName": theatreData.theatreName });
            if (existingData) return res.status(404).send({ message: "Theatre with the same name is already Exists" });

            const theatreCreation = await SuperAdminMethods.createUser(Theatres, theatreData);
            const theatreID = theatreCreation.id
            return res.status(200).send({ message: "Theatre is Defined", theatreID })
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: "Theatre creation Error", err })
        }
    }

    async createMovie(req: Request, res: Response) {
        try {
            let screenCount = 0;
            const handlerId = (req as any).owner
            const screenData = {
                theatreId: handlerId,
                theatreName: req.body.theatreName,
                screenName: req.body.screenName,
                movie: req.body.movie,
                date: new Date(req.body.date),
                session: new Date(req.body.session),
                totalSeats: req.body.totalSeats,
                availableSeats: req.body.totalSeats,
                budgetClassCapacity: req.body.totalSeats * 0.15,
                executiveClassCapacity: req.body.totalSeats * 0.50,
                firstClassCapacity: req.body.totalSeats * 0.35
            };




            const currentDate = new Date();
            const sevenDays = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            const providedDate = screenData.date;

            if (providedDate < sevenDays) {
                return res.status(400).send({ message: "Schedule for the week should be defined prior a Week" });
            }

            const theatreData = await SuperAdminMethods.findOne(Theatres, { "theatreName": screenData.theatreName });
            if (!theatreData) return res.status(404).send({ message: "Theatre does not Exists" });

            const dateCount = await SuperAdminMethods.count(Movies, { "date": new Date(screenData.date) });
            if (dateCount == 0 || dateCount < (theatreData.totalScreen * theatreData.totalSession)) {

                const existingData = await SuperAdminMethods.findOne(Movies, { "screenName": screenData.screenName,"session":screenData.session });
                const sessionCount = await SuperAdminMethods.count(Movies, { "date": screenData.session });


                if (existingData) {
                    console.log(existingData)
                    if ((existingData.screenName == screenData.screenName) &&
                        (((new Date(existingData.date)).getTime()) == (new Date(screenData.date)).getTime()) &&
                        ((screenData.session).getTime() == (existingData.session).getTime())) {
                        console.log(String(screenData.session), String(existingData.session))
                        return res.status(404).send({ message: `The screen is already defined for the session : ${screenData.session}` });

                    }
                    if (existingData.screenName != screenData.screenName) { 
                        if (sessionCount == 0 || sessionCount < theatreData.totalSession) {
                            console.log("screenName not equal")
                            const ScreenCreation = await SuperAdminMethods.createUser(Movies, screenData);
                            const movieId = ScreenCreation.id
                            const priceData = {
                                movieId: movieId,
                                budgetClass: req.body.budgetClass,
                                executiveClass: req.body.executiveClass,
                                firstClass: req.body.firstClass
                            }
                            await SuperAdminMethods.createUser(MoviePrices, priceData)
                            return res.status(200).send({ message: "Screen is Defined", movieId })
                        } else {
                            return res.status(400).send({ message: `Maximum no of session is defined for this movie : ${screenData.screenName}` })
                        }
                    }
                    if (existingData.screenName == screenData.screenName &&
                        (((new Date(existingData.date)).getTime()) == (new Date(screenData.date)).getTime()) &&
                        ((screenData.session).getTime() != (existingData.session).getTime())) {
                        console.log((screenData.session).getTime(), ".........",(existingData.session).getTime())
                        console.log("session not equal")
                        const ScreenCreation = await SuperAdminMethods.createUser(Movies, screenData);
                        const movieId = ScreenCreation.id
                        const priceData = {
                            movieId: movieId,
                            budgetClass: req.body.budgetClass,
                            executiveClass: req.body.executiveClass,
                            firstClass: req.body.firstClass
                        }
                        await SuperAdminMethods.createUser(MoviePrices, priceData)
                        return res.status(200).send({ message: "Screen is Defined", movieId })
                    }


                } else {
                    const ScreenCreation = await SuperAdminMethods.createUser(Movies, screenData);
                    const movieId = ScreenCreation.id
                    const priceData = {
                        movieId: movieId,
                        budgetClass: req.body.budgetClass,
                        executiveClass: req.body.executiveClass,
                        firstClass: req.body.firstClass
                    }
                    await SuperAdminMethods.createUser(MoviePrices, priceData)
                    return res.status(200).send({ message: "Screen is Defined", movieId })
                }

            } else {
                return res.status(400).send({ message: `Maximum no of screen is defined for the day : ${screenData.date}` })
            }
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: "Theatre creation Error", err })
        }
    }


    async sessionUpdate(req: Request, res: Response) {
        try {
            const screenData = req.body;
            if (screenData.totalSeats) {
                screenData.availableSeats = req.body.totalSeats
                screenData.budgetClassCapacity = req.body.totalSeats * 0.15
                screenData.executiveClassCapacity = req.body.totalSeats * 0.50
                screenData.firstClassCapacity = req.body.totalSeats * 0.35
            };
            const existingUpdate = await SuperAdminMethods.findOne(Movies, { "movie": screenData.movieId });
            if (existingUpdate) {
                return res.send({ message: "Movie already updated" })
            }
            const currentDate = new Date();
            const twoDays = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);
            const providedDate = new Date(screenData.date);
            console.log(twoDays, providedDate)

            if (providedDate < twoDays) {
                return res.status(400).send({ message: "The movie cannot be updated before two days" });
            }
            const existingData = await SuperAdminMethods.findWithPk(Movies, screenData.screenId)
            if (!existingData) return res.status(404).send({ message: "Thers is no such screen Exists" });

            const updatedData = await SuperAdminMethods.update(Movies, { screenData }, { 'id': screenData.screenId }, 1)
            console.log(updatedData, "check>>>>>>>>")
            if (updatedData === 1) {
                console.log('Update successful.');
                return res.status(200).send({ message: "Movie Updated" })
            } else {
                console.log('Movie Can be updated only once');
                return res.send({ message: "Movie Updation Failed" })
            }
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: "Session updation Error", err })
        }
    }

}


export default new OwnerCon