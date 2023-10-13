import { where } from "sequelize";

class SuperAdminMethods {
    async getAll(model:any,data?:any){
        return await model.findAll(data);
    }
    

    async createUser(model: any, user: any) {
        return await model.create(user);
    }


    async findWithPk(model: any, userId: any) {
        return await model.findByPk(userId);
    }


    async findOne(model: any, whereCondition: any) {
        return await model.findOne({ where: whereCondition });
    }


    async update(model: any, updateData: any,whereCondition :any,limit?:number) {
        return await model.update(updateData, { where: whereCondition ,limit})
    }
    

    async count(model: any,whereCondition : any) {
        return await model.count({ where: whereCondition})
    }

    async deleteWithPk(model:any,whereCondition:any){
        return await model.destroy({where:whereCondition})
    }
}

export default new SuperAdminMethods