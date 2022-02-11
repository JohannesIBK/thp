import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ path: "/api/live-stats", cors: { origin: "http://localhost:4242", credentials: true } })
export class StatsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("receive-stats")
  handleEvent(client: Socket, data: any): void {
    if (client.handshake.address !== "127.0.0.1") return;
    this.server.emit("stats", data);
  }
}
