import { extensions } from "sequelize/types/utils/validator-extras";
import sequelize from "../config/db"
import { Sequelize, Model, DataTypes } from "sequelize";

class Users extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
}


Users.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Users",
    timestamps: true
}
)
class Booking extends Model {
    public id!: number;
    public userId!: number;
    public movieId!: number;
    public tickets!: JSON;
    public price!: number;
    public totalTicket!: number;


}

Booking.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    movieId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tickets: {
        type: DataTypes.JSON,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalTicket: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    sequelize,
    modelName: "Bookings",
    timestamps: true
})


export { Users, Booking };  