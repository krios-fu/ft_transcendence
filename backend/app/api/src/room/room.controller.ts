import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller()
export class RoomController {

    @UseGuards(PrivateRoomGuard)
    @Get(':roomId')

}