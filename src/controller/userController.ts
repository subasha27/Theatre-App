import { Request, Response } from "express";
import { Users, Booking } from "../model/userModel";
import SuperAdminMethods from "../model/modelMethods";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import generateAndSaveInvoice from "../helpers/invoice";
import EmailService from "../helpers/sendEmail";
import dotenv from "dotenv";
import { Movies, MoviePrices, Theatres } from "../model/theatreModel";
import { toCharCode } from "pdf-lib";
import { string } from "@hapi/joi";
dotenv.config();

class UserController {

    async create(req: Request, res: Response) {
        try {
            const userData = req.body;
            const hashedPass = await bcrypt.hash(userData.password, 10)
            userData.password = hashedPass
            const existingData = await SuperAdminMethods.findOne(Users, { "email": req.body.email });
            if (existingData) {
                return res.status(403).send({ message: "User Already Exists" });
            }
            const adminCreate = await SuperAdminMethods.createUser(Users, userData)
            const adminId = adminCreate.id
            res.status(200).send({ message: "User Created Successfully", adminId })
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: "User Creation Error", err })
        }
    }

    async login(req: Request, res: Response) {
        try {
            const userData = req.body;
            const existingData = await SuperAdminMethods.findOne(Users, { "email": req.body.email });
            if (!existingData) return res.status(404).send({ message: "User does not Exists" });

            else {
                const dehashPass = await bcrypt.compare(userData.password, existingData.password)
                if (dehashPass) {
                    const token = jwt.sign({ id: existingData.id, email: userData.email }, process.env.userSecretKey as string);
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
    async getTheatre(req: Request, res: Response) {
        try {
            const userLocation = req.body.location
            const theatreSearch = await SuperAdminMethods.getAll(Theatres, { "location": userLocation });
            if (!theatreSearch) return res.send({ message: "There is no Theatres available in your area" })
            return res.status(200).send({ message: "Movie List", theatreSearch })
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: "Error", err })
        }
    }

    async getList(req: Request, res: Response) {
        try {
        
            const theatreId = req.params.theatreId
            const movieList = await SuperAdminMethods.getAll(Movies, {
                where: { theatreId:theatreId },
                include: [
                    {
                        model: MoviePrices,
                        as: 'prices',
                        attributes: ['budgetClass', 'executiveClass', 'firstClass'],
                    },
                ],
            });
            return res.status(200).send({ message: "Movie List", movieList })
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: "Error", err })
        }
    }

    async booking(req: Request, res: Response) {
        try {
            let price = 0;
            const userId = ((req as any).userId)
            const userEmail = ((req as any).userEmail)
            const bookingData = req.body;
            const existingMovie = await SuperAdminMethods.findWithPk(Movies, bookingData.movieId);
            if (!existingMovie) return res.send({ message: "No Movie available" });

            const existingBooking = await SuperAdminMethods.getAll(Booking, {userId:userId})
            let maxTicket=0;
            for(const ticket of existingBooking){
               maxTicket += Number(ticket.totalTicket)
            }
            
            const bookingLimit = await SuperAdminMethods.findOne(Theatres, existingMovie.theatreId)
            if ((existingBooking) && maxTicket >= bookingLimit.bookingLimit) {
                return res.send({ message: "User Can book 6 ticket only" })
            }

            let data = [];
            let err = [];
            let totalTicket = 0;
            let eachTicketPrice: { [ticketType: string]: number } = {};
            const ticketData: { [key: string]: number } = {};
            for (const loopData of bookingData.tickets) {

                data[0] = String(Object.keys(loopData))
                data[1] = Number(Object.values(loopData))

                const ticketClass = await SuperAdminMethods.findOne(MoviePrices, { "movieId": bookingData.movieId });

                if (ticketClass) {
                    if (existingMovie.availableSeats > 0) {
                        if (data[0] == "budgetClass") {
                            if (existingMovie.budgetClassCapacity > 0) {
                                if (data[1] != 0) {
                                    if (existingMovie.budgetClassCapacity - data[1] >= 0) {
                                        ticketData["budgetClassCapacity"] = (existingMovie.budgetClassCapacity - data[1]);
                                        eachTicketPrice["budgetClass"] = Number(ticketClass.budgetClass);

                                        price = Number(price) + ticketClass.budgetClass * data[1]
                                        totalTicket = totalTicket + data[1]

                                    } else {
                                        err.push(`Invalid ticket amount the available ticket for the budget class is ${existingMovie.budgetClassCapacity}`)
                                    }
                                } else {
                                    err.push(`Invalid ticket amount`)
                                }
                            } else {
                                err.push(`Invalid ticket amount the available ticket for the budget class is ${existingMovie.budgetClassCapacity}`)
                            }
                        }
                        if (data[0] == "executiveClass") {
                            if (existingMovie.executiveClassCapacity > 0) {
                                if (data[1] != 0) {
                                    if (existingMovie.executiveClassCapacity - data[1] >= 0) {
                                        ticketData["executiveClassCapacity"] = (existingMovie.executiveClassCapacity - data[1]);
                                        eachTicketPrice["executiveClass"] = Number(ticketClass.executiveClass);

                                        price = Number(price) + ticketClass.executiveClass * data[1]
                                        totalTicket = totalTicket + data[1]

                                    } else {
                                        err.push(`Invalid ticket amount the available ticket for the executive class is ${existingMovie.executiveClassCapacity}`)

                                    }
                                } else {
                                    err.push(`Invalid ticket amount`)
                                }
                            } else {
                                err.push(`Invalid ticket amount the available ticket for the budget class is ${existingMovie.executiveClassCapacity}`)
                            }
                        }
                        if (data[0] == "firstClass") {
                            if (existingMovie.firstClassCapacity > 0) {
                                if (data[1] != 0) {
                                    if (existingMovie.firstClassCapacity - data[1] >= 0) {
                                        ticketData["firstClassCapacity"] = (existingMovie.firstClassCapacity - data[1]);
                                        eachTicketPrice["firstClass"] = Number(ticketClass.firstClass);

                                        price = Number(price) + ticketClass.firstClass * data[1]
                                        totalTicket = totalTicket + data[1]

                                    } else {
                                        err.push(`Invalid ticket amount the available ticket for the first class is ${existingMovie.firstClassCapacity}`)

                                    }
                                } else {
                                    err.push(`Invalid ticket amount`)
                                }
                            } else {
                                err.push(`Invalid ticket amount the available ticket for the budget class is ${existingMovie.firstClassCapacity}`)
                            }
                        }
                    }
                } else {
                    return res.send({ message: "Invalid Movie Id" })
                }
            }
            if (totalTicket > bookingLimit.bookingLimit) {
                return res.send({ message: "User Can book 6 ticket only" })
            }

            if (err.length > 0) {
                return res.send({ message: "Booking Error", err })
            } else {
                const updatedSeats = await SuperAdminMethods.findWithPk(Movies, bookingData.movieId);
                if (updatedSeats) {
                    const updatedData = await SuperAdminMethods.update(Movies, ticketData, { "id": bookingData.movieId });

                    await Movies.update({ availableSeats: (updatedSeats.availableSeats - totalTicket) }, { where: { id: bookingData.movieId } })
                }
            }

            const updatedBookingData = {
                userId: userId,
                movieId: req.body.movieId,
                tickets: req.body.tickets,
                price: price,
                totalTicket: totalTicket
            }

            const booked = await SuperAdminMethods.createUser(Booking, updatedBookingData)
            await generateAndSaveInvoice(bookingData, eachTicketPrice, price,new Date(existingMovie.session))
                .then((filepath) => {
                    console.log(`Invoice saved as: ${filepath}`);
                })
                .catch((err) => {
                    console.error('Error generating and saving invoice:', err);
                });
            await EmailService.sendEmail(userEmail, `Booking Details`, `Tickets are Booked`, "../THEATRE/src/invoice/invoice.pdf")
            return res.send({ message: `Booking successfull, Booking Id :${booked.id}`, booked })
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: "Booking Error", err })
        }


    }


    async cancellation(req: Request, res: Response) {
        try {
            const bookingId = req.params.id;
            const userId = (req as any).userId;
            const userEmail = (req as any).userEmail;

            let ticketData: { [ticketType: string]: number } = {};

            const booking = await SuperAdminMethods.findWithPk(Booking, bookingId);
            if (!booking) {
                return res.status(404).send({ message: "Booking not found" });
            }

            const movieId = booking.movieId;
            const movie = await SuperAdminMethods.findWithPk(Movies, movieId);
            if (movie) {
                for (const data of booking.tickets) {
                    const ticketType = Object.keys(data)[0];
                    const quantity = data[ticketType];
                    if (ticketType == 'budgetClass'){
                        ticketData["budgetClassCapacity"] = Number(quantity) + movie.budgetClassCapacity
                    }
                    if (ticketType == 'executiveClass'){
                        ticketData["executiveClassCapacity"] = Number(quantity) + movie.executiveClassCapacity
                    }
                    if (ticketType == 'firstClass'){
                        ticketData["firstClassCapacity"] = Number(quantity) + movie.firstClassCapacity
                    }
                }
                const totalTicket = booking.totalTicket;
                await SuperAdminMethods.update(Movies,ticketData,{ id: movieId })
                await SuperAdminMethods.update(Movies,{availableSeats:(movie.availableSeats + booking.totalTicket)},{ id: movieId })
            }

            await SuperAdminMethods.deleteWithPk(Booking, { id: bookingId });
            await EmailService.sendMail(userEmail, `Booking Cancellation Details`, `Tickets have been canceled for your booking`);

            return res.send({ message: `Booking with ID ${bookingId} has been canceled successfully` });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Cancellation Error", err });
        }
    }
}

export default new UserController