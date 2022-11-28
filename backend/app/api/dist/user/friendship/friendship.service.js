"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendshipService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user.entity");
const friendship_repository_1 = require("./friendship.repository");
const friendship_entity_1 = require("./friendship.entity");
const typeorm_2 = require("typeorm");
let FriendshipService = class FriendshipService {
    constructor(friendRepository, datasource) {
        this.friendRepository = friendRepository;
        this.datasource = datasource;
        console.log("FriendshipService inicializado");
    }
    async addFriend(senderId, receiverId) {
        const friendship = new friendship_entity_1.FriendshipEntity();
        const queryRunner = this.datasource.createQueryRunner();
        let users;
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            users = await queryRunner.manager.find(user_entity_1.UserEntity, {
                where: [
                    { username: senderId },
                    { username: receiverId }
                ]
            });
            if (users.length != 2)
                throw new common_1.HttpException("Not Found", common_1.HttpStatus.NOT_FOUND);
            friendship.sender = users[0].username === senderId
                ? users[0] : users[1];
            friendship.receiver = users[0].username === receiverId
                ? users[0] : users[1];
            if ((await queryRunner.manager.find(friendship_entity_1.FriendshipEntity, {
                where: {
                    senderId: receiverId,
                    receiverId: senderId
                }
            })).length != 0)
                throw new common_1.HttpException("Conflict", common_1.HttpStatus.CONFLICT);
            await queryRunner.manager.insert(friendship_entity_1.FriendshipEntity, friendship);
            await queryRunner.commitTransaction();
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException("Internal Server Error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
        return friendship;
    }
    async getFriends(userId) {
        return (await this.friendRepository.createQueryBuilder("friendship")
            .leftJoinAndSelect("friendship.sender", "sender", "sender.username!= :id", { id: userId })
            .leftJoinAndSelect("friendship.receiver", "receiver", "receiver.username!= :id", { id: userId })
            .where("friendship.senderId= :id"
            + "AND friendship.status= :status", {
            id: userId,
            status: friendship_entity_1.FriendshipStatus.CONFIRMED
        })
            .orWhere("friendship.receiverId= :id"
            + "AND friendship.status= :status", {
            id: userId,
            status: friendship_entity_1.FriendshipStatus.CONFIRMED
        })
            .getMany());
    }
    async getOneFriend(userId, friendId) {
        return (await this.friendRepository.createQueryBuilder("friendship")
            .leftJoinAndSelect("friendship.sender", "sender", "sender.username!= :id", { id: userId })
            .leftJoinAndSelect("friendship.receiver", "receiver", "receiver.username!= :id", { id: userId })
            .where("friendship.senderId= :uId"
            + "AND friendship.receiverId= :fId"
            + "AND friendship.status= :status", {
            uId: userId,
            fId: friendId,
            status: friendship_entity_1.FriendshipStatus.CONFIRMED
        })
            .orWhere("friendship.receiverId= :uId"
            + "AND friendship.senderId= :fId"
            + "AND friendship.status= :status", {
            uId: userId,
            fId: friendId,
            status: friendship_entity_1.FriendshipStatus.CONFIRMED
        })
            .getOne());
    }
    async acceptFriend(receiverId, senderId) {
        return await this.friendRepository.update({
            senderId: senderId,
            receiverId: receiverId,
            status: friendship_entity_1.FriendshipStatus.PENDING
        }, { status: friendship_entity_1.FriendshipStatus.CONFIRMED });
    }
};
FriendshipService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(0, (0, typeorm_1.InjectRepository)(friendship_entity_1.FriendshipEntity)),
    __metadata("design:paramtypes", [friendship_repository_1.FriendshipRepository,
        typeorm_2.DataSource])
], FriendshipService);
exports.FriendshipService = FriendshipService;
//# sourceMappingURL=friendship.service.js.map