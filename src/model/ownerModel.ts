import sequelize from "../config/db"
import { Sequelize, Model, DataTypes } from "sequelize";

class Owners extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public firstLogin!: boolean;
}


Owners.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstLogin:{
        type: DataTypes.BOOLEAN,
        allowNull:true
    }
}, {
    sequelize,
    modelName: "Owners",
    timestamps: true
}
)

export default Owners;  