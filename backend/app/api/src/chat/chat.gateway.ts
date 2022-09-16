import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection, OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer, WsResponse
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
    console.log( this.server );
  }


  handleConnection(client: any, ...args): any {
      console.log('Join connection ');
      console.log("---> " +  client.id)
      console.log(args);
  }

  handleDisconnect( client: any ){
      console.log('Disconnect');
      console.log(client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data : any, @ConnectedSocket() client : Socket) {
      console.log(data)
      console.log(this.server)
     this.server.emit( 'message', data );
  }
}
