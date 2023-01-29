import { Test, TestingModule } from '@nestjs/testing';
import { QueryMapper } from 'src/common/mappers/query.mapper';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { RoomRolesController } from './room_roles.controller';
import { RoomRolesService } from './room_roles.service';

describe('RoomRolesController', () => {
  let controller: RoomRolesController;
//  let service: RoomRolesService; <- mock this!!

  const mockUser: CreateUserDto = {
    username: 'test-user',
    firstName: 'firstName',
    lastName: 'lastName',
    profileUrl: '(nil)',
    email: 'email@domain.ab',
    photoUrl: '(nil)'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomRolesController],
      providers: [RoomRolesService, QueryMapper],
    })
    .compile();

    controller = module.get<RoomRolesController>(RoomRolesController);
    //service = module.get<RoomRolesService>(RoomRolesService);
    /* login logic */
  });

  /* afterEach */

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Testing route GET  /room_roles', () => {
    it('should return an empty list when no room_roles are posted', () => {
      expect(2).toBe(2);
    });
    it ('should return a list with size 1 when only one role has been posted', () => {

    });
    it ('should return a list of size 3 if three roles have been posted', () => {

    })
  });

  describe('Testing route GET /room_roles/:id', () => {
    it ('placeholder', () => {

    });
    it ('placeholder', () => {

    });
    it ('placeholder', () => {

    });
    it ('placeholder', () => {

    });
    /* it should test GET /room_roles/:id AND
      throw a 404 (not found) if no room is present
      throw a 404 (not found) if no role is present
      throw a 200 (found) if there is a room with a role present
    */
  });

  describe('Testing route GET /room_roles/rooms/:id', () => {
   /* it should test GET /room_roles/rooms/:id 
      no room -> should return a 404
      room with no roles -> should return ???
      room with roles -> POST 1 -> should return a list of size 1
                      -> POST 3 -> should return a list of size 3
    */
  });

  /* it should test POST /room_roles
    post to a nonexistent room or role -> 404
    post a non['official', 'private'] role -> 201 (el posteo de roles random está capado)
    post an ['official'] not being admin -> 403
    post a ['private'] not being admmin or owner -> 403
    post an  ['official'] being admin -> 201
    post a ['private'] being admin or owner -> 201
    */
   /* it should test DELETE /room_roles
    delete a nonexistent role in room -> 404
    delete a random role of a room -> 204
    delete an official role of a room NOT being admin -> 403
    delete an official role of a room being an admin -> 204
    delete a private role of a room not being an owner or admin -> 403
    delete a private role of a room being an owner or an admin -> 204
    */
   /* it should test PUT /room_roles/:id
      * change pwd with wrong creds being owner -> 403
      * change pwd with right creds being owner -> 201
      * change pwd with wrong creds not being owner  -> 403
      * change pwd with right creds not being owner -> 403
      * change pwd to room being not private -> 400
      * change pwd to non existent room -> 400
   */
});
