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
Object.defineProperty(exports, "__esModule", { value: true });
class SuperAdminMethods {
    getAll(model, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.findAll(data);
        });
    }
    createUser(model, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.create(user);
        });
    }
    findWithPk(model, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.findByPk(userId);
        });
    }
    findOne(model, whereCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.findOne({ where: whereCondition });
        });
    }
    update(model, updateData, whereCondition, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.update(updateData, { where: whereCondition, limit });
        });
    }
    count(model, whereCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.count({ where: whereCondition });
        });
    }
    deleteWithPk(model, whereCondition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield model.destroy({ where: whereCondition });
        });
    }
}
exports.default = new SuperAdminMethods;
