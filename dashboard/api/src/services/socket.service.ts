import { Injectable } from "@nestjs/common";
import { Socket, io } from "socket.io-client";
import { StatsEntity } from "../database/stats.entity";

@Injectable()
export class SocketService {
  socket: Socket;

  constructor() {
    this.socket = io("http://localhost:3300", { path: "/api/live-stats" });
  }

  sendStats(stats: StatsEntity): void {
    console.log(stats);
    this.socket.emit("receive-stats", stats);
  }
}
