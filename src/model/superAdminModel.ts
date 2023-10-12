import sequelize from "../config/db"
import { Sequelize, Model, DataTypes } from "sequelize";

class SuperAdmins extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
}


SuperAdmins.init({
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
    modelName: "SuperAdmins",
    timestamps: true
}
)



export {SuperAdmins};  