import {
    OnGatewayConnection, OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {Public} from "../decorators/public.decorator";


@WebSocketGateway(3001, {
    namespace : 'private',
    cors : { origin : '*' }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
    server : Server;

  afterInit(Server : any)
  {
    console.log( 'Start Chat Gatewey' );
  }


  handleConnection(client: any, ...args): any {
      console.log('Join connection ');
      console.log(client.id);
  }

  handleDisconnect( client: any ){
      console.log('Disconnect');
      console.log(client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('new connection');
    return 'Hello world!';
  }
}
