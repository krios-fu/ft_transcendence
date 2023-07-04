import { MigrationInterface, QueryRunner } from "typeorm";

export class base1685987394035 implements MigrationInterface {
    name = 'base1685987394035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "achievements" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" BIGSERIAL NOT NULL, "achievement_name" character varying NOT NULL, "description" character varying NOT NULL, "photo_url" character varying NOT NULL, CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "achievement_user" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" BIGSERIAL NOT NULL, "user_id" integer NOT NULL, "achievement_id" bigint NOT NULL, CONSTRAINT "PK_635944ebf4aa97cae0cf6ca1ac9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8f36b8352e0ecc2876ae37c6a0" ON "achievement_user" ("achievement_id", "user_id") `);
        await queryRunner.query(`CREATE TABLE "refresh_token" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "token" uuid NOT NULL DEFAULT uuid_generate_v4(), "expiresIn" TIMESTAMP NOT NULL, "token_user" integer, CONSTRAINT "REL_7c8a6ce55bc2cddf1640f07679" UNIQUE ("token_user"), CONSTRAINT "PK_c31d0a2f38e6e99110df62ab0af" PRIMARY KEY ("token"))`);
        await queryRunner.query(`CREATE TABLE "chat_messages" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "content" character varying NOT NULL, "chat_user_id" bigint NOT NULL, CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chats" ("id" SERIAL NOT NULL, "begin_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_user" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" BIGSERIAL NOT NULL, "chat_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_15d83eb496fd7bec7368b30dbf3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_936f0e4735e47330e546b7bf9d" ON "chat_user" ("chat_id", "user_id") `);
        await queryRunner.query(`CREATE TABLE "user_roles" ("id" BIGSERIAL NOT NULL, "user_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_23ed6f04fe43066df08379fd03" ON "user_roles" ("role_id", "user_id") `);
        await queryRunner.query(`CREATE TABLE "users_room" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" BIGSERIAL NOT NULL, "user_id" integer NOT NULL, "room_id" integer NOT NULL, CONSTRAINT "PK_1e1a0d791813fd8606ba8d10063" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ae9359018843a8ce6677598d19" ON "users_room" ("user_id", "room_id") `);
        await queryRunner.query(`CREATE TABLE "user_room_roles" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" BIGSERIAL NOT NULL, "user_room_id" bigint NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_65b862e996fdd336266d219cb70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_24f023280cdb6599add2cecf18" ON "user_room_roles" ("user_room_id", "role_id") `);
        await queryRunner.query(`CREATE TABLE "roles" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "role" character varying(15) NOT NULL, CONSTRAINT "UQ_ccc7c1489f3a6b3c9b47d4537c5" UNIQUE ("role"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_roles" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "room_id" integer NOT NULL, "role_id" integer NOT NULL, "password" character varying(60), CONSTRAINT "PK_ff8b2db2fafa57e1678157f4d6d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f3e382cccecd2b6f7b278e8c71" ON "room_roles" ("room_id", "role_id") `);
        await queryRunner.query(`CREATE TABLE "ban" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" BIGSERIAL NOT NULL, "user_id" integer NOT NULL, "room_id" integer NOT NULL, CONSTRAINT "PK_071cddb7d5f18439fd992490618" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2b83883206680fec1c174bca00" ON "ban" ("user_id", "room_id") `);
        await queryRunner.query(`CREATE TABLE "room" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "room_id" character varying(15) NOT NULL, "owner_id" integer NOT NULL, "photoUrl" character varying, CONSTRAINT "UQ_483751c0abab68ed1ac952ae920" UNIQUE ("room_id"), CONSTRAINT "UQ_75b669dabdba9995ca6d46b894a" UNIQUE ("photoUrl"), CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "username" character varying(11) NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "photoUrl" character varying NOT NULL DEFAULT 'http://localhost:3000/default-avatar.jpg', "profileUrl" character varying NOT NULL, "nickName" character varying(11) NOT NULL, "doubleAuth" boolean NOT NULL DEFAULT false, "doubleAuthSecret" character varying, "defaultOffline" boolean NOT NULL DEFAULT false, "ranking" integer NOT NULL DEFAULT '1500', "category" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_f15a1d20dcbcde42b43563aaecb" UNIQUE ("nickName"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "winner" ("id" SERIAL NOT NULL, "ranking" integer NOT NULL, "category" integer NOT NULL, "score" integer NOT NULL, "userId" integer, CONSTRAINT "PK_fa2886a53e844d01b8fc5524560" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "loser" ("id" SERIAL NOT NULL, "ranking" integer NOT NULL, "category" integer NOT NULL, "score" integer NOT NULL, "userId" integer, CONSTRAINT "PK_c6acdede2f722ea6145c03e8b8c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "match" ("id" SERIAL NOT NULL, "official" boolean NOT NULL, "playedAt" TIMESTAMP NOT NULL DEFAULT now(), "winnerId" integer, "loserId" integer, CONSTRAINT "REL_367ddf891f920aae1b66735319" UNIQUE ("winnerId"), CONSTRAINT "REL_b6831d9812d6d8b1d77a6bd97f" UNIQUE ("loserId"), CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "block" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "friendship_id" bigint NOT NULL, "block_sender_id" integer NOT NULL, "blockSender_id" integer, CONSTRAINT "REL_8d1d60477dbc685d89caad013f" UNIQUE ("friendship_id"), CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "friendship" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" BIGSERIAL NOT NULL, "sender_id" integer NOT NULL, "receiver_id" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', CONSTRAINT "PK_dbd6fb568cd912c5140307075cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e909f47b70f90358e20b0f61a5" ON "friendship" ("sender_id", "receiver_id") `);
        await queryRunner.query(`ALTER TABLE "achievement_user" ADD CONSTRAINT "FK_86c0b3a5048a46519c0326311cf" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_user" ADD CONSTRAINT "FK_8411242f7f09b3434c6e8725b26" FOREIGN KEY ("achievement_id") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_7c8a6ce55bc2cddf1640f07679b" FOREIGN KEY ("token_user") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_5b0dbc0ca10b08844264615a8e4" FOREIGN KEY ("chat_user_id") REFERENCES "chat_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_user" ADD CONSTRAINT "FK_c1b936340cd2724c49041115003" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_user" ADD CONSTRAINT "FK_c2d1ec937246fe834e099f4a159" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_room" ADD CONSTRAINT "FK_6d85576014897ffd5cc0bf1b922" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_room" ADD CONSTRAINT "FK_a4f25a0f5d8144a5a258bf38241" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_room_roles" ADD CONSTRAINT "FK_b941fc1f120520dc375158d974f" FOREIGN KEY ("user_room_id") REFERENCES "users_room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_room_roles" ADD CONSTRAINT "FK_0c08181296f52b8986b36e758db" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_roles" ADD CONSTRAINT "FK_c774d64435e080ed0b93690f5f8" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_roles" ADD CONSTRAINT "FK_81cc03b158da7ce780ededafe5a" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ban" ADD CONSTRAINT "FK_eced4a90a3dbd381124b86e0d51" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ban" ADD CONSTRAINT "FK_fd3de5d2d4bbb83bb9246d61c21" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_6dfeeefd28618a1351a1a1a9171" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "winner" ADD CONSTRAINT "FK_20116ece29f9de16952a0628f6e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loser" ADD CONSTRAINT "FK_bc9c04227f26d07200b525f3092" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_367ddf891f920aae1b667353193" FOREIGN KEY ("winnerId") REFERENCES "winner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_b6831d9812d6d8b1d77a6bd97fb" FOREIGN KEY ("loserId") REFERENCES "loser"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "FK_8d1d60477dbc685d89caad013ff" FOREIGN KEY ("friendship_id") REFERENCES "friendship"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "FK_199ec16fa18acffe6496a660b26" FOREIGN KEY ("blockSender_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_86463167c10dc37dbf9d39728bd" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_8cced01afb7c006b9643aed97bf" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
//        await queryRunner.release();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_8cced01afb7c006b9643aed97bf"`);
        await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_86463167c10dc37dbf9d39728bd"`);
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "FK_199ec16fa18acffe6496a660b26"`);
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "FK_8d1d60477dbc685d89caad013ff"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_b6831d9812d6d8b1d77a6bd97fb"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_367ddf891f920aae1b667353193"`);
        await queryRunner.query(`ALTER TABLE "loser" DROP CONSTRAINT "FK_bc9c04227f26d07200b525f3092"`);
        await queryRunner.query(`ALTER TABLE "winner" DROP CONSTRAINT "FK_20116ece29f9de16952a0628f6e"`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_6dfeeefd28618a1351a1a1a9171"`);
        await queryRunner.query(`ALTER TABLE "ban" DROP CONSTRAINT "FK_fd3de5d2d4bbb83bb9246d61c21"`);
        await queryRunner.query(`ALTER TABLE "ban" DROP CONSTRAINT "FK_eced4a90a3dbd381124b86e0d51"`);
        await queryRunner.query(`ALTER TABLE "room_roles" DROP CONSTRAINT "FK_81cc03b158da7ce780ededafe5a"`);
        await queryRunner.query(`ALTER TABLE "room_roles" DROP CONSTRAINT "FK_c774d64435e080ed0b93690f5f8"`);
        await queryRunner.query(`ALTER TABLE "user_room_roles" DROP CONSTRAINT "FK_0c08181296f52b8986b36e758db"`);
        await queryRunner.query(`ALTER TABLE "user_room_roles" DROP CONSTRAINT "FK_b941fc1f120520dc375158d974f"`);
        await queryRunner.query(`ALTER TABLE "users_room" DROP CONSTRAINT "FK_a4f25a0f5d8144a5a258bf38241"`);
        await queryRunner.query(`ALTER TABLE "users_room" DROP CONSTRAINT "FK_6d85576014897ffd5cc0bf1b922"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "chat_user" DROP CONSTRAINT "FK_c2d1ec937246fe834e099f4a159"`);
        await queryRunner.query(`ALTER TABLE "chat_user" DROP CONSTRAINT "FK_c1b936340cd2724c49041115003"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_5b0dbc0ca10b08844264615a8e4"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_7c8a6ce55bc2cddf1640f07679b"`);
        await queryRunner.query(`ALTER TABLE "achievement_user" DROP CONSTRAINT "FK_8411242f7f09b3434c6e8725b26"`);
        await queryRunner.query(`ALTER TABLE "achievement_user" DROP CONSTRAINT "FK_86c0b3a5048a46519c0326311cf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e909f47b70f90358e20b0f61a5"`);
        await queryRunner.query(`DROP TABLE "friendship"`);
        await queryRunner.query(`DROP TABLE "block"`);
        await queryRunner.query(`DROP TABLE "match"`);
        await queryRunner.query(`DROP TABLE "loser"`);
        await queryRunner.query(`DROP TABLE "winner"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b83883206680fec1c174bca00"`);
        await queryRunner.query(`DROP TABLE "ban"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f3e382cccecd2b6f7b278e8c71"`);
        await queryRunner.query(`DROP TABLE "room_roles"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_24f023280cdb6599add2cecf18"`);
        await queryRunner.query(`DROP TABLE "user_room_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ae9359018843a8ce6677598d19"`);
        await queryRunner.query(`DROP TABLE "users_room"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_23ed6f04fe43066df08379fd03"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_936f0e4735e47330e546b7bf9d"`);
        await queryRunner.query(`DROP TABLE "chat_user"`);
        await queryRunner.query(`DROP TABLE "chats"`);
        await queryRunner.query(`DROP TABLE "chat_messages"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f36b8352e0ecc2876ae37c6a0"`);
        await queryRunner.query(`DROP TABLE "achievement_user"`);
        await queryRunner.query(`DROP TABLE "achievements"`);
///        await queryRunner.release();
    }

}
