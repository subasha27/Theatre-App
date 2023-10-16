"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviePrices = exports.Movies = exports.Theatres = void 0;
const db_1 = __importDefault(require("../config/db"));
const sequelize_1 = require("sequelize");
class Theatres extends sequelize_1.Model {
}
exports.Theatres = Theatres;
Theatres.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    theatreName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    theatreId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    totalScreen: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    capacity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    bookingLimit: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    totalSession: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: db_1.default,
    modelName: "Theatres",
    timestamps: true
});
class Movies extends sequelize_1.Model {
}
exports.Movies = Movies;
Movies.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    theatreId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    screenName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    movie: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    session: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    totalSeats: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    availableSeats: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    budgetClassCapacity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    executiveClassCapacity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    firstClassCapacity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize: db_1.default,
    modelName: "Movies",
    timestamps: true
});
class MoviePrices extends sequelize_1.Model {
}
exports.MoviePrices = MoviePrices;
MoviePrices.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    movieId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    budgetClass: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    executiveClass: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    firstClass: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize: db_1.default,
    modelName: "MoviePrices",
    timestamps: true
});
Movies.hasMany(MoviePrices, {
    foreignKey: 'movieId',
    sourceKey: 'id',
    as: 'prices',
});
MoviePrices.belongsTo(Movies, {
    foreignKey: 'movieId',
    targetKey: 'id',
});
Movies.belongsTo(Theatres, {
    foreignKey: 'theatreId',
    targetKey: 'theatreId',
});
