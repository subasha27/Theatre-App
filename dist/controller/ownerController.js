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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ownerModel_1 = __importDefault(require("../model/ownerModel"));
const theatreModel_1 = require("../model/theatreModel");
const modelMethods_1 = __importDefault(require("../model/modelMethods"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class OwnerCon {
    InitialLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ownerData = req.body;
                const existingData = yield modelMethods_1.default.findOne(ownerModel_1.default, { "email": req.body.email });
                if (!existingData) {
                    return res.status(403).send({ message: "owner does not Exists" });
                }
                if (existingData && existingData.firstLogin == false) {
                    return res.send({ message: "owner already did the initial Login" });
                }
                const hashedPass = yield bcrypt_1.default.hash(ownerData.newPassword, 10);
                yield modelMethods_1.default.update(ownerModel_1.default, { password: hashedPass, firstLogin: false }, { 'email': ownerData.email });
                return res.status(200).send({ message: "owner Initial login Successfully", });
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "Admin Creation Error", err });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ownerData = req.body;
                const existingData = yield modelMethods_1.default.findOne(ownerModel_1.default, { "email": req.body.email });
                if (!existingData) {
                    return res.status(404).send({ message: "owner does not Exists" });
                }
                if (existingData && existingData.firstLogin == true) {
                    return res.send({ message: "Complete the initial Login first" });
                }
                else {
                    const dehashPass = yield bcrypt_1.default.compare(ownerData.password, existingData.password);
                    if (dehashPass) {
                        const token = jsonwebtoken_1.default.sign(existingData.id, process.env.ownerSecretKey);
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
    createTheatre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const theatreData = req.body;
                const handlerId = req.owner;
                theatreData.theatreId = handlerId;
                const existingData = yield modelMethods_1.default.findOne(theatreModel_1.Theatres, { "theatreName": theatreData.theatreName });
                if (existingData)
                    return res.status(404).send({ message: "Theatre with the same name is already Exists" });
                const theatreCreation = yield modelMethods_1.default.createUser(theatreModel_1.Theatres, theatreData);
                const theatreID = theatreCreation.id;
                return res.status(200).send({ message: "Theatre is Defined", theatreID });
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "Theatre creation Error", err });
            }
        });
    }
    createMovie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let screenCount = 0;
                const handlerId = req.owner;
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
                const theatreData = yield modelMethods_1.default.findOne(theatreModel_1.Theatres, { "theatreName": screenData.theatreName });
                if (!theatreData)
                    return res.status(404).send({ message: "Theatre does not Exists" });
                const dateCount = yield modelMethods_1.default.count(theatreModel_1.Movies, { "date": new Date(screenData.date) });
                if (dateCount == 0 || dateCount < (theatreData.totalScreen * theatreData.totalSession)) {
                    const existingData = yield modelMethods_1.default.findOne(theatreModel_1.Movies, { "screenName": screenData.screenName, "session": screenData.session });
                    const sessionCount = yield modelMethods_1.default.count(theatreModel_1.Movies, { "date": screenData.session });
                    if (existingData) {
                        if ((existingData.screenName == screenData.screenName) &&
                            (((new Date(existingData.date)).getTime()) == (new Date(screenData.date)).getTime()) &&
                            ((screenData.session).getTime() == (existingData.session).getTime())) {
                            return res.status(404).send({ message: `The screen is already defined for the session : ${screenData.session}` });
                        }
                        if (existingData.screenName != screenData.screenName) {
                            if (sessionCount == 0 || sessionCount < theatreData.totalSession) {
                                const ScreenCreation = yield modelMethods_1.default.createUser(theatreModel_1.Movies, screenData);
                                const movieId = ScreenCreation.id;
                                const priceData = {
                                    movieId: movieId,
                                    budgetClass: req.body.budgetClass,
                                    executiveClass: req.body.executiveClass,
                                    firstClass: req.body.firstClass
                                };
                                yield modelMethods_1.default.createUser(theatreModel_1.MoviePrices, priceData);
                                return res.status(200).send({ message: "Screen is Defined", movieId });
                            }
                            else {
                                return res.status(400).send({ message: `Maximum no of session is defined for this movie : ${screenData.screenName}` });
                            }
                        }
                        if (existingData.screenName == screenData.screenName &&
                            (((new Date(existingData.date)).getTime()) == (new Date(screenData.date)).getTime()) &&
                            ((screenData.session).getTime() != (existingData.session).getTime())) {
                            const ScreenCreation = yield modelMethods_1.default.createUser(theatreModel_1.Movies, screenData);
                            const movieId = ScreenCreation.id;
                            const priceData = {
                                movieId: movieId,
                                budgetClass: req.body.budgetClass,
                                executiveClass: req.body.executiveClass,
                                firstClass: req.body.firstClass
                            };
                            yield modelMethods_1.default.createUser(theatreModel_1.MoviePrices, priceData);
                            return res.status(200).send({ message: "Screen is Defined", movieId });
                        }
                    }
                    else {
                        const ScreenCreation = yield modelMethods_1.default.createUser(theatreModel_1.Movies, screenData);
                        const movieId = ScreenCreation.id;
                        const priceData = {
                            movieId: movieId,
                            budgetClass: req.body.budgetClass,
                            executiveClass: req.body.executiveClass,
                            firstClass: req.body.firstClass
                        };
                        yield modelMethods_1.default.createUser(theatreModel_1.MoviePrices, priceData);
                        return res.status(200).send({ message: "Screen is Defined", movieId });
                    }
                }
                else {
                    return res.status(400).send({ message: `Maximum no of screen is defined for the day : ${screenData.date}` });
                }
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "Theatre creation Error", err });
            }
        });
    }
    sessionUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const screenData = req.body;
                if (screenData.totalSeats) {
                    screenData.availableSeats = req.body.totalSeats;
                    screenData.budgetClassCapacity = req.body.totalSeats * 0.15;
                    screenData.executiveClassCapacity = req.body.totalSeats * 0.50;
                    screenData.firstClassCapacity = req.body.totalSeats * 0.35;
                }
                ;
                const existingUpdate = yield modelMethods_1.default.findOne(theatreModel_1.Movies, { "movie": screenData.movieId });
                if (existingUpdate) {
                    return res.send({ message: "Movie already updated" });
                }
                const currentDate = new Date();
                const twoDays = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);
                const providedDate = new Date(screenData.date);
                if (providedDate < twoDays) {
                    return res.status(400).send({ message: "The movie cannot be updated before two days" });
                }
                const existingData = yield modelMethods_1.default.findWithPk(theatreModel_1.Movies, screenData.screenId);
                if (!existingData)
                    return res.status(404).send({ message: "Thers is no such screen Exists" });
                const updatedData = yield modelMethods_1.default.update(theatreModel_1.Movies, { screenData }, { 'id': screenData.screenId }, 1);
                if (updatedData === 1) {
                    console.log('Update successful.');
                    return res.status(200).send({ message: "Movie Updated" });
                }
                else {
                    console.log('Movie Can be updated only once');
                    return res.send({ message: "Movie Updation Failed" });
                }
            }
            catch (err) {
                console.error(err);
                return res.status(500).send({ message: "Session updation Error", err });
            }
        });
    }
}
exports.default = new OwnerCon;
