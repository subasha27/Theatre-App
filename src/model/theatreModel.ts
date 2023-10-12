import sequelize from "../config/db"
import { Sequelize, Model, DataTypes } from "sequelize";

class Theatres extends Model {
    public id!: number;
    public theatreName!: string;
    public theatreId!: number;
    public totalScreen!: number;
    public capacity!: number;
    public location!: string;
    public bookingLimit!: number;
}


Theatres.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    theatreName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    theatreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    totalScreen: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    location:{
        type:DataTypes.STRING,
        allowNull:false
    },
    bookingLimit:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
}, {
    sequelize,
    modelName: "Theatres",
    timestamps: true
}
)

class Movies extends Model {
    public id!: Number;
    public theatreId!: String;
    public screenName!: String;
    public movie!: String;
    public date!: Date;
    public totalSession!: number;
    public totalSeats!: number;
    public availableSeats!: number;
    public budgetClassCapacity!: number;
    public executiveClassCapacity!: number;
    public firstClassCapacity!: number;
    public movieId!: number;

}


Movies.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    theatreId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    screenName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    movie: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    totalSession: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalSeats: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    availableSeats: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    budgetClassCapacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    executiveClassCapacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    firstClassCapacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: "Movies",
    timestamps: true
})

class MoviePrices extends Model {
    public id!: number;
    public movieId!: number;
    public budgetClass!: number;
    public executiveClass!: number;
    public firstClass!: number;
}

MoviePrices.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    movieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    budgetClass: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    executiveClass: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    firstClass: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: "MoviePrices",
    timestamps: true
}
)

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


export { Theatres, Movies, MoviePrices };  