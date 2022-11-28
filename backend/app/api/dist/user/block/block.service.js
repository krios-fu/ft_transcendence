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
exports.BlockService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const friendship_repository_1 = require("../friendship/friendship.repository");
const friendship_mapper_1 = require("../friendship/friendship.mapper");
const friendship_entity_1 = require("../friendship/friendship.entity");
const block_entity_1 = require("../block/block.entity");
const block_repository_1 = require("./block.repository");
const typeorm_2 = require("typeorm");
let BlockService = class BlockService {
    constructor(friendRepository, friendMapper, blockRepository, datasource) {
        this.friendRepository = friendRepository;
        this.friendMapper = friendMapper;
        this.blockRepository = blockRepository;
        this.datasource = datasource;
        console.log("BlockService inicializado");
    }
    async blockFriend(blockSenderId, blockReceiverId) {
        const blockEntity = new block_entity_1.BlockEntity();
        const friendship = await this.friendRepository.findOne({
            relations: {
                sender: true,
                receiver: true
            },
            where: [
                {
                    senderId: blockSenderId,
                    receiverId: blockReceiverId,
                    status: friendship_entity_1.FriendshipStatus.CONFIRMED
                },
                {
                    senderId: blockReceiverId,
                    receiverId: blockSenderId,
                    status: friendship_entity_1.FriendshipStatus.CONFIRMED
                }
            ],
        });
        if (!friendship)
            throw new common_1.HttpException("Not Found", common_1.HttpStatus.NOT_FOUND);
        blockEntity.blockSender = friendship.senderId === blockSenderId
            ? friendship.sender : friendship.receiver;
        friendship.status = friendship_entity_1.FriendshipStatus.BLOCKED;
        friendship.block = blockEntity;
        return await this.friendRepository.save(friendship);
    }
    async unblockFriend(blockSenderId, blockReceiverId) {
        const queryRunner = this.datasource.createQueryRunner();
        let blockFriendship;
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            blockFriendship = await queryRunner.manager
                .findOne(friendship_entity_1.FriendshipEntity, {
                relations: {
                    block: true
                },
                where: [
                    {
                        senderId: blockReceiverId,
                        block: {
                            blockSender: {
                                username: blockSenderId
                            }
                        },
                        status: friendship_entity_1.FriendshipStatus.BLOCKED
                    },
                    {
                        receiverId: blockReceiverId,
                        block: {
                            blockSender: {
                                username: blockSenderId
                            }
                        },
                        status: friendship_entity_1.FriendshipStatus.BLOCKED
                    }
                ]
            });
            if (!blockFriendship)
                throw new common_1.HttpException("Not Found", common_1.HttpStatus.NOT_FOUND);
            blockFriendship.status = friendship_entity_1.FriendshipStatus.CONFIRMED;
            await queryRunner.manager.save(friendship_entity_1.FriendshipEntity, blockFriendship);
            await queryRunner.manager.remove(block_entity_1.BlockEntity, blockFriendship.block);
            await queryRunner.commitTransaction();
        }
        catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction();
            throw new common_1.HttpException("Internal Server Error", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
    }
    async getBlockedFriends(userId) {
        const blockedFriendships = await this.friendRepository.find({
            relations: {
                sender: true,
                receiver: true,
            },
            select: {
                senderId: true,
                sender: {
                    nickName: true,
                },
                receiverId: true,
                receiver: {
                    nickName: true,
                },
            },
            where: [
                {
                    block: {
                        blockSender: {
                            username: userId
                        }
                    },
                    status: friendship_entity_1.FriendshipStatus.BLOCKED,
                }
            ],
        });
        let friends = [];
        for (let i = 0; i < blockedFriendships.length; ++i) {
            friends.push(this.friendMapper.toBlockedFriendDto(userId, blockedFriendships[i]));
        }
        return (friends);
    }
};
BlockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(friendship_entity_1.FriendshipEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(block_entity_1.BlockEntity)),
    __metadata("design:paramtypes", [friendship_repository_1.FriendshipRepository,
        friendship_mapper_1.FriendMapper,
        block_repository_1.BlockRepository,
        typeorm_2.DataSource])
], BlockService);
exports.BlockService = BlockService;
//# sourceMappingURL=block.service.js.map