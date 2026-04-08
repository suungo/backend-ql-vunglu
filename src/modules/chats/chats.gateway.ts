import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chats' })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatsService: ChatsService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() conversationId: number, @ConnectedSocket() client: Socket) {
    client.join(`room_${conversationId}`);
    return { event: 'joinedRoom', data: conversationId };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { conversationId: number; senderId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const msg = await this.chatsService.sendMessage(data.conversationId, data.senderId, data.content);
    this.server.to(`room_${data.conversationId}`).emit('newMessage', msg);
    return msg;
  }
}
