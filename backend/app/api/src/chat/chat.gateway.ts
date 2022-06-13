import {OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(
    3001,
    {
      namespace: "private",
      cors : { origin : '*' }
    })
export class ChatGateway implements OnGatewayInit{

  @WebSocketServer() server : Server;

  afterInit(Server : any)
  {
    console.log('INIT SERVER');
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('new connetion');
    return 'Hello world!';
  }
}
