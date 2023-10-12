import { Sequelize } from "sequelize";


const sequelize = new Sequelize(
    'theatre',
    'root',
    'rootpass',{
        host:'localhost',
        dialect:'mysql',
        timezone: '+05:30',
    }
)

sequelize.authenticate().then(()=>{
    console.log("Connection established successfully")
}).catch((error)=>{
    console.log("Connection Error",error)
})

export default sequelize;