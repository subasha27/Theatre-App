"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("../model/userModel");
const modelMethods_1 = __importDefault(require("../model/modelMethods"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const invoice_1 = __importDefault(require("../helpers/invoice"));
const sendEmail_1 = __importDefault(require("../helpers/sendEmail"));
const dotenv_1 = __importDefault(require("dotenv"));
const theatreModel_1 = require("../model/theatreModel");
dotenv_1.default.config();
class UserController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const hashedPass = yield bcrypt_1.default.hash(userData.password, 10);
                userData.password = hashedPass;
                const existingData = yield modelMethods_1.default.findOne(userModel_1.Users, { "email": req.body.email });
                if (existingData) {
                    return res.status(403).send({ message: "User Already Exists" });
                }
                const adminCreate = yield modelMethods_1.default.createUser(userModel_1.Users, userData);
                const adminId = adminCreate.id;
                res.status(200).send({ message: "User Created Successfully", adminId });
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "User Creation Error", err });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const existingData = yield modelMethods_1.default.findOne(userModel_1.Users, { "email": req.body.email });
                if (!existingData)
                    return res.status(404).send({ message: "User does not Exists" });
                else {
                    const dehashPass = yield bcrypt_1.default.compare(userData.password, existingData.password);
                    if (dehashPass) {
                        const token = jsonwebtoken_1.default.sign({ id: existingData.id, email: userData.email }, process.env.userSecretKey);
                        return res.status(200).send({ message: "login Successfully", token });
                    }
                    else {
                        return res.status(401).send({ message: "Invalid Password" });
                    }
                }
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "Login Error", err });
            }
        });
    }
    getTheatre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userLocation = req.body.location;
                const theatreSearch = yield modelMethods_1.default.getAll(theatreModel_1.Theatres, { "location": userLocation });
                if (!theatreSearch)
                    return res.send({ message: "There is no Theatres available in your area" });
                return res.status(200).send({ message: "Movie List", theatreSearch });
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "Error", err });
            }
        });
    }
    getList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theatreId = req.body.theatreId;
                const movieList = yield modelMethods_1.default.getAll(theatreModel_1.Movies, {
                    where: { theatreId },
                    include: [
                        {
                            model: theatreModel_1.MoviePrices,
                            as: 'prices',
                            attributes: ['budgetClass', 'executiveClass', 'firstClass'],
                        },
                    ],
                });
                return res.status(200).send({ message: "Movie List", movieList });
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "Error", err });
            }
        });
    }
    booking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let price = 0;
                const userId = (req.userId);
                const userEmail = (req.userEmail);
                const bookingData = req.body;
                const existingMovie = yield modelMethods_1.default.findWithPk(theatreModel_1.Movies, bookingData.movieId);
                if (!existingMovie)
                    return res.send({ message: "No Movie available" });
                const existingBooking = yield modelMethods_1.default.findOne(userModel_1.Booking, userId);
                console.log(existingBooking);
                const bookingLimit = yield modelMethods_1.default.findOne(theatreModel_1.Theatres, existingMovie.theatreId);
                if ((existingBooking) && existingBooking.totalTicket >= bookingLimit.bookingLimit) {
                    return res.send({ message: "User Can book 6 ticket only" });
                }
                let data = [];
                let err = [];
                let totalTicket = 0;
                let eachTicketPrice = {};
                const ticketData = {};
                for (const loopData of bookingData.tickets) {
                    data[0] = String(Object.keys(loopData));
                    data[1] = Number(Object.values(loopData));
                    const ticketClass = yield modelMethods_1.default.findOne(theatreModel_1.MoviePrices, { "movieId": bookingData.movieId });
                    if (ticketClass) {
                        if (existingMovie.availableSeats > 0) {
                            if (data[0] == "budgetClass") {
                                if (existingMovie.budgetClassCapacity > 0) {
                                    if (data[1] != 0) {
                                        if (existingMovie.budgetClassCapacity - data[1] >= 0) {
                                            ticketData["budgetClassCapacity"] = (existingMovie.budgetClassCapacity - data[1]);
                                            eachTicketPrice["budgetClass"] = Number(ticketClass.budgetClass);
                                            price = Number(price) + ticketClass.budgetClass * data[1];
                                            totalTicket = totalTicket + data[1];
                                        }
                                        else {
                                            err.push(`Invalid ticket amount the available ticket for the budget class is ${existingMovie.budgetClassCapacity}`);
                                        }
                                    }
                                    else {
                                        err.push(`Invalid ticket amount`);
                                    }
                                }
                                else {
                                    err.push(`Invalid ticket amount the available ticket for the budget class is ${existingMovie.budgetClassCapacity}`);
                                }
                            }
                            if (data[0] == "executiveClass") {
                                if (existingMovie.executiveClassCapacity > 0) {
                                    if (data[1] != 0) {
                                        if (existingMovie.executiveClassCapacity - data[1] >= 0) {
                                            ticketData["executiveClassCapacity"] = (existingMovie.executiveClassCapacity - data[1]);
                                            eachTicketPrice["executiveClass"] = Number(ticketClass.executiveClass);
                                            price = Number(price) + ticketClass.executiveClass * data[1];
                                            totalTicket = totalTicket + data[1];
                                        }
                                        else {
                                            err.push(`Invalid ticket amount the available ticket for the executive class is ${existingMovie.executiveClassCapacity}`);
                                        }
                                    }
                                    else {
                                        err.push(`Invalid ticket amount`);
                                    }
                                }
                                else {
                                    err.push(`Invalid ticket amount the available ticket for the budget class is ${existingMovie.executiveClassCapacity}`);
                                }
                            }
                            if (data[0] == "firstClass") {
                                if (existingMovie.firstClassCapacity > 0) {
                                    if (data[1] != 0) {
                                        if (existingMovie.firstClassCapacity - data[1] >= 0) {
                                            ticketData["firstClassCapacity"] = (existingMovie.firstClassCapacity - data[1]);
                                            eachTicketPrice["firstClass"] = Number(ticketClass.firstClass);
                                            price = Number(price) + ticketClass.firstClass * data[1];
                                            totalTicket = totalTicket + data[1];
                                        }
                                        else {
                                            err.push(`Invalid ticket amount the available ticket for the first class is ${existingMovie.firstClassCapacity}`);
                                        }
                                    }
                                    else {
                                        err.push(`Invalid ticket amount`);
                                    }
                                }
                                else {
                                    err.push(`Invalid ticket amount the available ticket for the budget class is ${existingMovie.firstClassCapacity}`);
                                }
                            }
                        }
                    }
                    else {
                        return res.send({ message: "Invalid Movie Id" });
                    }
                }
                if (totalTicket > bookingLimit.bookingLimit) {
                    return res.send({ message: "User Can book 6 ticket only" });
                }
                if (err.length > 0) {
                    return res.send({ message: "Booking Error", err });
                }
                else {
                    const updatedSeats = yield modelMethods_1.default.findWithPk(theatreModel_1.Movies, bookingData.movieId);
                    if (updatedSeats) {
                        const updatedData = yield modelMethods_1.default.update(theatreModel_1.Movies, ticketData, { "id": bookingData.movieId });
                        yield theatreModel_1.Movies.update({ availableSeats: (updatedSeats.availableSeats - totalTicket) }, { where: { id: bookingData.movieId } });
                    }
                }
                const updatedBookingData = {
                    userId: userId,
                    movieId: req.body.movieId,
                    tickets: req.body.tickets,
                    price: price,
                    totalTicket: totalTicket
                };
                const booked = yield modelMethods_1.default.createUser(userModel_1.Booking, updatedBookingData);
                yield (0, invoice_1.default)(bookingData, eachTicketPrice, price)
                    .then((filepath) => {
                    console.log(`Invoice saved as: ${filepath}`);
                })
                    .catch((err) => {
                    console.error('Error generating and saving invoice:', err);
                });
                yield sendEmail_1.default.sendEmail(userEmail, `Booking Details`, `Tickets are Booked`, "../THEATRE/src/invoice/invoice.pdf");
                return res.send({ message: `Booking successfull, Booking Id :${booked.id}`, booked });
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "Booking Error", err });
            }
        });
    }
}
exports.default = new UserController;
